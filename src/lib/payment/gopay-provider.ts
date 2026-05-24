import "server-only";

import type { PaymentProvider } from "@/lib/payment/types";

export class GoPayPaymentProvider implements PaymentProvider {
  name = "gopay" as const;

  async createCheckoutSession(
    _orderId: string,
    _amount: number,
    _customerEmail?: string,
    _orderNumber?: string,
  ): Promise<never> {
    throw new Error("GoPay integrace není implementována");
  }

  async handleWebhook(): Promise<never> {
    throw new Error("GoPay integrace není implementována");
  }

  async getPaymentStatus(): Promise<never> {
    throw new Error("GoPay integrace není implementována");
  }
}
