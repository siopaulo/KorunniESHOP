import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminProducts } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Produkty</h1>
          <p className="text-sm text-muted-foreground">{products.length} produktů</p>
        </div>
        <Button asChild>
          <Link href="/admin/produkty/novy">
            <Plus className="h-4 w-4" /> Nový produkt
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4">Název</th>
              <th className="p-4">Kategorie</th>
              <th className="p-4">Cena</th>
              <th className="p-4">Sklad</th>
              <th className="p-4">Stav</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/60 last:border-0">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-muted-foreground">
                  {(product.product_categories as { name?: string } | null)?.name ?? "—"}
                </td>
                <td className="p-4">{formatPrice(Number(product.price))}</td>
                <td className="p-4">{product.stock_quantity}</td>
                <td className="p-4">
                  <Badge variant={product.is_active ? "default" : "outline"}>
                    {product.is_active ? "Aktivní" : "Skrytý"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/produkty/${product.id}`}>Upravit</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
