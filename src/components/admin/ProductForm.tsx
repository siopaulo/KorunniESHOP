"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import {
  upsertProductAction,
  type ActionResult,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CategoryRow, ProductRow } from "@/types/database";

const initial: ActionResult = {};

interface ProductFormProps {
  product?: ProductRow;
  categories: CategoryRow[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [state, action, pending] = useActionState(upsertProductAction, initial);

  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Název</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Adresa v URL</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="mydlo-s-levanduli" />
          <p className="text-xs text-muted-foreground">Krátký text v adrese produktu</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Kategorie</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.category_id}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Cena (CZK)</Label>
          <Input id="price" name="price" type="number" min={0} step={1} defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Původní cena</Label>
          <Input id="compareAtPrice" name="compareAtPrice" type="number" min={0} defaultValue={product?.compare_at_price ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Sklad</Label>
          <Input id="stockQuantity" name="stockQuantity" type="number" min={0} defaultValue={product?.stock_quantity ?? 0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU (skladová značka)</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} placeholder="např. MYD-KOP-001" />
          <p className="text-xs text-muted-foreground">
            Interní kód produktu pro sklad a objednávky. Zákazníci ho nevidí — slouží vám k
            rozlišení variant (volitelné).
          </p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="shortDescription">Krátký popis</Label>
          <Textarea id="shortDescription" name="shortDescription" defaultValue={product?.short_description} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Popis</Label>
          <Textarea id="description" name="description" rows={6} defaultValue={product?.description} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tags">Štítky (čárkou: novinka, bestseller, sleva)</Label>
          <Input id="tags" name="tags" defaultValue={product?.tags?.join(", ") ?? ""} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="isActive" name="isActive" defaultChecked={product?.is_active ?? true} />
          <Label htmlFor="isActive">Aktivní</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="isFeatured" name="isFeatured" defaultChecked={product?.is_featured ?? false} />
          <Label htmlFor="isFeatured">Vybraný produkt</Label>
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Ukládám…" : product ? "Uložit změny" : "Vytvořit produkt"}
      </Button>
    </form>
  );
}
