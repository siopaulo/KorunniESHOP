"use client";

import { toast } from "sonner";

import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  className?: string;
}

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  stockQuantity,
  imageUrl,
  className,
}: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem);

  if (stockQuantity <= 0) {
    return (
      <Button disabled size="sm" variant="outline" className={className}>
        Vyprodáno
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className={className}
      onClick={() => {
        addItem({ productId, slug, name, price, stockQuantity, imageUrl });
        toast.success("Přidáno do košíku");
      }}
    >
      Do košíku
    </Button>
  );
}
