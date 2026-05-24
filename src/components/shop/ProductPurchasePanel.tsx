"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { useCart } from "@/store/cart";
import type { ProductWithCategory } from "@/lib/data/product-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface ProductPurchasePanelProps {
  product: ProductWithCategory;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const imageUrl =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const inStock = product.stock_quantity > 0;
  const lowStock =
    inStock && product.stock_quantity <= product.low_stock_threshold;

  return (
    <div className="space-y-5 sm:space-y-6">
      {product.category && (
        <Link
          href={`/kategorie/${product.category.slug}`}
          className="inline-block text-sm font-medium text-sage hover:text-moss"
        >
          {product.category.name}
        </Link>
      )}

      <h1 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
        {product.name}
      </h1>

      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="accent">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
        <span className="text-xl font-semibold sm:text-2xl">
          {formatPrice(Number(product.price))}
        </span>
        {product.compare_at_price && (
          <span className="text-base text-muted-foreground line-through sm:text-lg">
            {formatPrice(Number(product.compare_at_price))}
          </span>
        )}
      </div>

      <p className="text-sm sm:text-base">
        {inStock ? (
          lowStock ? (
            <span className="text-amber-700">
              Poslední kusy skladem ({product.stock_quantity})
            </span>
          ) : (
            <span className="text-sage">Skladem ({product.stock_quantity} ks)</span>
          )
        ) : (
          <span className="text-destructive">Vyprodáno</span>
        )}
      </p>

      {product.short_description && (
        <p className="text-base leading-relaxed sm:text-lg">{product.short_description}</p>
      )}

      {inStock && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Množství
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    product.stock_quantity,
                    Math.max(1, Number(e.target.value) || 1),
                  ),
                )
              }
              className="w-full sm:w-24"
            />
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto sm:min-w-[200px]"
            onClick={() => {
              addItem(
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: Number(product.price),
                  stockQuantity: product.stock_quantity,
                  imageUrl,
                },
                quantity,
              );
              toast.success(`Přidáno ${quantity}× do košíku`);
            }}
          >
            Přidat do košíku
          </Button>
        </div>
      )}

      {product.description && (
        <div className="border-t border-border pt-5 sm:pt-6">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Popis</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
