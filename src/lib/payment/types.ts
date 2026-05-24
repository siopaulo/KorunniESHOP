/**
 * Payment provider interface — implementace ve fázi 4.
 * @see docs/ARCHITECTURE.md
 */

export type PaymentProviderName = "stripe" | "gopay";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

export interface WebhookResult {
  orderId: string;
  paymentStatus: PaymentStatus;
  providerPaymentId: string;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  createCheckoutSession(
    orderId: string,
    amount: number,
    customerEmail?: string,
    orderNumber?: string,
  ): Promise<CheckoutSessionResult>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
  getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus>;
}
