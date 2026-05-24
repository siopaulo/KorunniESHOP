import { notFound } from "next/navigation";

import { getAdminOrder } from "@/lib/data/admin";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const data = await getAdminOrder(id);
  if (!data.order) notFound();

  const { order, items, payments, invoices } = data;
  const customer = order.customers as {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Objednávka {order.order_number}</h1>
        <p className="text-sm text-muted-foreground">
          Vytvořeno {new Date(order.created_at).toLocaleString("cs-CZ")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Zákazník</h2>
          <p className="mt-2 text-sm">
            {customer?.first_name} {customer?.last_name}
            <br />
            {customer?.email}
            <br />
            {customer?.phone}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Platba a faktura</h2>
          <p className="mt-2 text-sm">Stav platby: {order.payment_status}</p>
          <p className="text-sm">Faktura: {order.invoice_status}</p>
          {payments[0] && (
            <p className="text-xs text-muted-foreground">Stripe: {payments[0].provider_payment_id}</p>
          )}
          {invoices[0] && (
            <p className="text-xs text-muted-foreground">
              Faktura č.: {invoices[0].invoice_number} ({invoices[0].status})
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Položky</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>{formatPrice(Number(item.total_price))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border pt-4 font-semibold">
          Celkem: {formatPrice(Number(order.total))}
        </div>
      </div>

      <OrderStatusForm
        orderId={order.id}
        currentStatus={order.status as OrderStatus}
        adminNote={order.admin_note}
      />
    </div>
  );
}
