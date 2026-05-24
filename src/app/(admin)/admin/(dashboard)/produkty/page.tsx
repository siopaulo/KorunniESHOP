import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsAdminTable } from "@/components/admin/ProductsAdminTable";
import { getAdminProducts } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    stock_quantity: p.stock_quantity,
    is_active: p.is_active,
    product_categories: p.product_categories as { name?: string } | null,
  }));

  return (
    <>
      <AdminPageHeader
        title="Produkty"
        description={`${products.length} produktů v katalogu`}
        actions={
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/produkty/novy">
              <Plus className="h-4 w-4" /> Nový produkt
            </Link>
          </Button>
        }
      />
      <ProductsAdminTable products={rows} />
    </>
  );
}
