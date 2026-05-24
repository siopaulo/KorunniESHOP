import { getStripe } from "@/lib/stripe/client";
import type {
  CheckoutSessionResult,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from "@/lib/payment/types";

export class StripePaymentProvider implements PaymentProvider {
  name = "stripe" as const;

  async createCheckoutSession(
    orderId: string,
    amount: number,
    customerEmail: string,
    orderNumber: string,
  ): Promise<CheckoutSessionResult> {
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: `Objednávka ${orderNumber}`,
              description: "Korunní Byliny — bylinné produkty",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId },
      success_url: `${siteUrl}/objednavka/uspech?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/objednavka/neuspech?order_id=${orderId}`,
    });

    if (!session.url) {
      throw new Error("Stripe session URL missing");
    }

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(payload: string, signature: string): Promise<WebhookResult> {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET missing");

    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (!orderId) throw new Error("Missing orderId in session metadata");

      return {
        orderId,
        paymentStatus: "paid",
        providerPaymentId: session.id,
      };
    }

    throw new Error(`Unhandled event type: ${event.type}`);
  }

  async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus> {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(providerPaymentId);
    if (session.payment_status === "paid") return "paid";
    if (session.status === "expired") return "failed";
    return "pending";
  }
}

export function getPaymentProvider(): StripePaymentProvider {
  return new StripePaymentProvider();
}
