import Link from "next/link";

import { getAdminOrders } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  new: "Nová",
  awaiting_payment: "Čeká na platbu",
  paid: "Zaplaceno",
  processing: "Připravuje se",
  shipped: "Odesláno",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
  returned: "Reklamace",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Objednávky</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4">Číslo</th>
              <th className="p-4">Zákazník</th>
              <th className="p-4">Stav</th>
              <th className="p-4">Celkem</th>
              <th className="p-4">Datum</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const customer = order.customers as {
                email?: string;
                first_name?: string;
                last_name?: string;
              } | null;
              return (
                <tr key={order.id} className="border-b border-border/60">
                  <td className="p-4 font-medium">{order.order_number}</td>
                  <td className="p-4 text-muted-foreground">
                    {customer?.first_name} {customer?.last_name}
                    <br />
                    <span className="text-xs">{customer?.email}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{statusLabels[order.status] ?? order.status}</Badge>
                  </td>
                  <td className="p-4">{formatPrice(Number(order.total))}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("cs-CZ")}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/objednavky/${order.id}`} className="text-sage hover:underline">
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
