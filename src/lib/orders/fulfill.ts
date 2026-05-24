import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getInvoiceProvider } from "@/lib/invoice/manual-provider";
import {
  sendOrderAdminNotificationEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
} from "@/lib/email/send";

export async function fulfillPaidOrder(orderId: string, stripeSessionId: string) {
  const supabase = createAdminClient();

  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id")
    .eq("provider_payment_id", stripeSessionId)
    .maybeSingle();

  if (existingPayment) {
    return { alreadyProcessed: true };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (order.status === "paid") {
    return { alreadyProcessed: true };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("email, first_name, last_name")
    .eq("id", order.customer_id ?? "")
    .maybeSingle();

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_status: "paid",
      stripe_payment_intent_id: stripeSessionId,
    })
    .eq("id", orderId);

  for (const item of orderItems ?? []) {
    if (!item.product_id) continue;
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();
    if (product) {
      await supabase
        .from("products")
        .update({
          stock_quantity: Math.max(0, product.stock_quantity - item.quantity),
        })
        .eq("id", item.product_id);
    }
  }

  await supabase.from("payments").insert({
    order_id: orderId,
    provider: "stripe",
    provider_payment_id: stripeSessionId,
    amount: order.total,
    currency: order.currency,
    status: "paid",
    metadata: { sessionId: stripeSessionId },
  });

  try {
    await getInvoiceProvider().createInvoice(orderId);
  } catch (e) {
    console.error("[invoice]", e);
  }

  const emailData = {
    orderNumber: order.order_number,
    customerEmail: customer?.email ?? "",
    customerName: `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
    total: Number(order.total),
    items: (orderItems ?? []).map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      totalPrice: Number(i.total_price),
    })),
  };

  if (emailData.customerEmail) {
    await sendOrderConfirmationEmail(emailData);
  }
  await sendOrderAdminNotificationEmail(emailData);

  return { alreadyProcessed: false };
}

export async function notifyOrderShipped(orderId: string) {
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number, customer_id")
    .eq("id", orderId)
    .single();

  if (!order?.customer_id) return;

  const { data: customer } = await supabase
    .from("customers")
    .select("email, first_name, last_name")
    .eq("id", order.customer_id)
    .single();

  if (!customer?.email) return;

  await sendOrderShippedEmail({
    orderNumber: order.order_number,
    customerEmail: customer.email,
    customerName: `${customer.first_name} ${customer.last_name}`.trim(),
  });
}
