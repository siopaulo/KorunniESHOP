"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export interface AdminProductRow {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  product_categories: { name?: string } | null;
}

interface ProductsAdminTableProps {
  products: AdminProductRow[];
}

export function ProductsAdminTable({ products }: ProductsAdminTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.product_categories?.name ?? "").toLowerCase().includes(q),
    );
  }, [products, search]);

  if (products.length === 0) {
    return (
      <AdminEmptyState
        title="Zatím žádné produkty"
        description="Vytvořte první produkt pro váš e-shop."
        action={
          <Button asChild>
            <Link href="/admin/produkty/novy">
              <Plus className="h-4 w-4" /> Nový produkt
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Hledat produkt nebo kategorii…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
        aria-label="Hledat produkty"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Žádný produkt neodpovídá hledání.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {filtered.map((product) => (
              <li
                key={product.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.product_categories?.name ?? "—"}
                    </p>
                  </div>
                  <Badge variant={product.is_active ? "default" : "outline"}>
                    {product.is_active ? "Aktivní" : "Skrytý"}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{formatPrice(Number(product.price))}</span>
                  <span className="text-muted-foreground">Sklad: {product.stock_quantity}</span>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link href={`/admin/produkty/${product.id}`}>Upravit</Link>
                </Button>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
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
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border/60 last:border-0">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {product.product_categories?.name ?? "—"}
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
        </>
      )}
    </div>
  );
}
