import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { StripePaymentProvider } from "@/lib/payment/stripe-provider";
import { fulfillPaidOrder } from "@/lib/orders/fulfill";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(`webhook:stripe:${ip}`, { limit: 100, windowMs: 60_000 });
  if (!rate.success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const provider = new StripePaymentProvider();
    const result = await provider.handleWebhook(payload, signature);
    await fulfillPaidOrder(result.orderId, result.providerPaymentId);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe webhook]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 400 },
    );
  }
}
