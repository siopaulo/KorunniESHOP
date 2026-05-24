"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { orderStatusLabel } from "@/lib/order-status-labels";

const STATUS_FILTERS = [
  { value: "all", label: "Vše" },
  { value: "new", label: "Nové" },
  { value: "paid", label: "Zaplaceno" },
  { value: "processing", label: "Připravuje se" },
  { value: "shipped", label: "Odesláno" },
  { value: "cancelled", label: "Zrušeno" },
] as const;

export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  customers: {
    email?: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

interface OrdersAdminTableProps {
  orders: AdminOrderRow[];
}

export function OrdersAdminTable({ orders }: OrdersAdminTableProps) {
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    if (status === "all") return orders;
    return orders.filter((o) => o.status === status);
  }, [orders, status]);

  if (orders.length === 0) {
    return (
      <AdminEmptyState
        title="Zatím žádné objednávky"
        description="Objednávky se zobrazí po prvním nákupu v e-shopu."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f.value}
            type="button"
            size="sm"
            variant={status === f.value ? "default" : "outline"}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">V tomto filtru nejsou žádné objednávky.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {filtered.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{order.order_number}</p>
                  <Badge variant="outline">
                    {orderStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.customers?.first_name} {order.customers?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{order.customers?.email}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{formatPrice(Number(order.total))}</span>
                  <span className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("cs-CZ")}
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link href={`/admin/objednavky/${order.id}`}>Detail</Link>
                </Button>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
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
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-0">
                    <td className="p-4 font-medium">{order.order_number}</td>
                    <td className="p-4 text-muted-foreground">
                      {order.customers?.first_name} {order.customers?.last_name}
                      <br />
                      <span className="text-xs">{order.customers?.email}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {orderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="p-4">{formatPrice(Number(order.total))}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("cs-CZ")}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="text-sage hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
