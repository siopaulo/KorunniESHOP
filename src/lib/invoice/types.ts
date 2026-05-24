/**
 * Invoice provider interface — implementace ve fázi 4.
 * @see docs/ARCHITECTURE.md
 */

export type InvoiceProviderName = "manual" | "fakturoid" | "idoklad";

export type InvoiceStatus = "draft" | "issued" | "sent" | "paid" | "cancelled";

export interface InvoiceResult {
  invoiceId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  pdfUrl?: string;
}

export interface InvoiceProvider {
  name: InvoiceProviderName;
  createInvoice(orderId: string): Promise<InvoiceResult>;
  getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus>;
  sendInvoice(invoiceId: string): Promise<void>;
}
