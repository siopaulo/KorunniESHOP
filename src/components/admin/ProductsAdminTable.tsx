"use client";



import Link from "next/link";

import { useRouter } from "next/navigation";

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

  const router = useRouter();

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

              <li key={product.id}>

                <div

                  role="link"

                  tabIndex={0}

                  onClick={() => router.push(`/admin/produkty/${product.id}`)}

                  onKeyDown={(e) => {

                    if (e.key === "Enter" || e.key === " ") {

                      e.preventDefault();

                      router.push(`/admin/produkty/${product.id}`);

                    }

                  }}

                  className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors hover:border-sage/40 hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

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

                  <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>

                    <Button asChild variant="outline" size="sm" className="flex-1">

                      <Link href={`/admin/produkty/${product.id}`}>Upravit</Link>

                    </Button>

                  </div>

                </div>

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

                  <tr

                    key={product.id}

                    className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30 focus-within:bg-muted/30"

                    onClick={() => router.push(`/admin/produkty/${product.id}`)}

                    tabIndex={0}

                    onKeyDown={(e) => {

                      if (e.key === "Enter") router.push(`/admin/produkty/${product.id}`);

                    }}

                  >

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

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>

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

