import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMetrics } from "@/lib/data/admin";
import { orderStatusLabel } from "@/lib/order-status-labels";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Přehled obchodu" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Objednávky dnes", value: metrics.ordersToday },
          { title: "Tržby tento měsíc", value: formatPrice(metrics.revenueMonth) },
          { title: "Produkty", value: metrics.productCount },
          { title: "Nízký sklad", value: metrics.lowStockCount },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Poslední objednávky</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Zatím žádné objednávky.</p>
          ) : (
            <ul className="space-y-3">
              {metrics.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link
                    href={`/admin/objednavky/${order.id}`}
                    className="min-w-0 truncate font-medium hover:text-sage"
                  >
                    {order.order_number}
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="outline">{orderStatusLabel(order.status)}</Badge>
                    <span>{formatPrice(Number(order.total))}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
