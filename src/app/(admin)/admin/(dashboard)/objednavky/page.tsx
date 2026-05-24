import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrdersAdminTable } from "@/components/admin/OrdersAdminTable";
import { getAdminOrders } from "@/lib/data/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  const rows = orders.map((o) => ({
    id: o.id,
    order_number: o.order_number,
    status: o.status,
    total: Number(o.total),
    created_at: o.created_at,
    customers: o.customers as {
      email?: string;
      first_name?: string;
      last_name?: string;
    } | null,
  }));

  return (
    <>
      <AdminPageHeader
        title="Objednávky"
        description={`${orders.length} objednávek celkem`}
      />
      <OrdersAdminTable orders={rows} />
    </>
  );
}
