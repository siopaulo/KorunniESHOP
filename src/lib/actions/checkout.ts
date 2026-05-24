"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { StripePaymentProvider } from "@/lib/payment/stripe-provider";
import {
  calculateShipping,
  checkoutSchema,
  type ShippingConfig,
} from "@/lib/validations/checkout";
import type { Json } from "@/types/database";

export type CheckoutActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createCheckoutAction(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rate = checkRateLimit(`checkout:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rate.success) {
    return { error: "Příliš mnoho pokusů. Zkuste to za chvíli." };
  }

  const billingSame = formData.get("billingSameAsShipping") === "on";

  const rawItems = formData.get("items");
  let items: { productId: string; quantity: number }[] = [];
  try {
    items = JSON.parse(String(rawItems ?? "[]")) as typeof items;
  } catch {
    return { error: "Neplatný košík" };
  }

  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    shippingAddress: {
      firstName: formData.get("shippingFirstName"),
      lastName: formData.get("shippingLastName"),
      street: formData.get("shippingStreet"),
      city: formData.get("shippingCity"),
      zip: formData.get("shippingZip"),
      country: "CZ",
    },
    billingSameAsShipping: billingSame,
    billingAddress: billingSame
      ? undefined
      : {
          firstName: formData.get("billingFirstName"),
          lastName: formData.get("billingLastName"),
          street: formData.get("billingStreet"),
          city: formData.get("billingCity"),
          zip: formData.get("billingZip"),
          country: "CZ",
        },
    customerNote: formData.get("customerNote") || undefined,
    termsConsent: formData.get("termsConsent") === "on" ? true : undefined,
    gdprConsent: formData.get("gdprConsent") === "on" ? true : undefined,
    items,
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      error: "Zkontrolujte prosím formulář",
    };
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const productIds = data.items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug, price, stock_quantity, sku, is_active")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError || !products?.length) {
    return { error: "Produkty v košíku nejsou dostupné" };
  }

  let subtotal = 0;
  const orderItems: {
    product_id: string;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[] = [];

  for (const line of data.items) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) return { error: "Produkt již není dostupný" };
    if (product.stock_quantity < line.quantity) {
      return { error: `${product.name} — nedostatečný sklad` };
    }
    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * line.quantity;
    subtotal += totalPrice;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
      quantity: line.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("shipping_config")
    .limit(1)
    .single();

  const shippingConfig = (settings?.shipping_config ?? {
    flatRate: 99,
    freeShippingThreshold: 1500,
  }) as unknown as ShippingConfig;

  const shippingCost = calculateShipping(subtotal, shippingConfig);
  const total = subtotal + shippingCost;

  const billingAddress = data.billingSameAsShipping
    ? data.shippingAddress
    : data.billingAddress!;

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        email: data.email,
        first_name: data.shippingAddress.firstName,
        last_name: data.shippingAddress.lastName,
        phone: data.phone,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (customerError || !customer) {
    return { error: "Nepodařilo se uložit zákazníka" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      status: "awaiting_payment",
      subtotal,
      shipping_cost: shippingCost,
      discount: 0,
      total,
      currency: "CZK",
      shipping_address: data.shippingAddress as unknown as Json,
      billing_address: billingAddress as unknown as Json,
      customer_note: data.customerNote ?? null,
      payment_status: "pending",
      gdpr_consent: data.gdprConsent,
      terms_consent: data.termsConsent,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { error: "Nepodařilo se vytvořit objednávku" };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  if (itemsError) {
    return { error: "Nepodařilo se uložit položky objednávky" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      error:
        "Platby nejsou nakonfigurovány (STRIPE_SECRET_KEY). Objednávka byla vytvořena jako awaiting_payment.",
    };
  }

  const stripe = new StripePaymentProvider();
  const session = await stripe.createCheckoutSession(
    order.id,
    total,
    data.email,
    order.order_number,
  );

  await supabase.from("payments").insert({
    order_id: order.id,
    provider: "stripe",
    provider_payment_id: session.sessionId,
    amount: total,
    currency: "CZK",
    status: "pending",
    metadata: { sessionId: session.sessionId },
  });

  redirect(session.url);
}
