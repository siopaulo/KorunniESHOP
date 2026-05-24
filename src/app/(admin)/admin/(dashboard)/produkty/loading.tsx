import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";

export default function AdminProductsLoading() {
  return (
    <AdminTableSkeleton
      title="Produkty"
      description="Načítání katalogu…"
    />
  );
}
