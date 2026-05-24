"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center sm:p-12">
        <p className="text-muted-foreground">Váš košík je prázdný.</p>
        <Button asChild className="mt-6 w-full sm:w-auto">
          <Link href="/produkty">Prohlédnout produkty</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="space-y-3 sm:space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-[4rem_1fr] gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-4 sm:p-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {item.imageUrl ? (
                <CloudinaryImage
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  crop="fill"
                  sizes="80px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <Link
                href={`/produkty/${item.slug}`}
                className="font-medium hover:text-sage line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price)} / ks
              </p>
              <div className="mt-2 flex items-center gap-2 sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  aria-label="Snížit množství"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  aria-label="Zvýšit množství"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <span className="ml-auto font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:flex sm:justify-end">
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  aria-label="Snížit množství"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  aria-label="Zvýšit množství"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="hidden font-medium sm:block">
                {formatPrice(item.price * item.quantity)}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.productId)}
                aria-label="Odebrat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold sm:text-xl">Souhrn</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Položky ({totalItems()})</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Doprava</span>
            <span>Vypočítá se v pokladně</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>Mezisoučet</span>
          <span>{formatPrice(subtotal())}</span>
        </div>
        <Button asChild className="mt-6 w-full" size="lg">
          <Link href="/pokladna">Pokračovat k pokladně</Link>
        </Button>
      </div>
    </div>
  );
}
