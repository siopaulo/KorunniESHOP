import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { InvoiceProvider, InvoiceResult, InvoiceStatus } from "@/lib/invoice/types";

export class ManualInvoiceProvider implements InvoiceProvider {
  name = "manual" as const;

  async createInvoice(orderId: string): Promise<InvoiceResult> {
    const supabase = createAdminClient();

    const { data: order } = await supabase
      .from("orders")
      .select("order_number")
      .eq("id", orderId)
      .single();

    const invoiceNumber = order?.order_number
      ? `FV-${order.order_number}`
      : `FV-${orderId.slice(0, 8)}`;

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        order_id: orderId,
        provider: "manual",
        invoice_number: invoiceNumber,
        status: "draft",
      })
      .select("id, invoice_number, status")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Invoice create failed");

    await supabase
      .from("orders")
      .update({ invoice_status: "pending" })
      .eq("id", orderId);

    return {
      invoiceId: data.id,
      invoiceNumber: data.invoice_number ?? invoiceNumber,
      status: data.status as InvoiceResult["status"],
    };
  }

  async getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("invoices")
      .select("status")
      .eq("id", invoiceId)
      .single();
    return (data?.status as InvoiceStatus) ?? "draft";
  }

  async sendInvoice(): Promise<void> {
    // Manual provider — admin sends invoice outside the system
  }
}

export function getInvoiceProvider(): ManualInvoiceProvider {
  return new ManualInvoiceProvider();
}
