import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminOrdersLoading() {
  return (
    <AdminTableSkeleton
      title="Objednávky"
      description="Načítání objednávek…"
      withSearch={false}
    />
  );
}
