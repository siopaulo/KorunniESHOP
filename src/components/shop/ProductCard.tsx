import Link from "next/link";

import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductWithCategory } from "@/lib/data/product-types";
import { getPrimaryImageUrl } from "@/lib/data/product-types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryImageUrl(product.images);

  return (
    <Card className="overflow-hidden">
      <Link href={`/produkty/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted">
          {imageUrl ? (
            <CloudinaryImage
              src={imageUrl}
              alt={product.name}
              fill
              crop="fill"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-sage-light/30 to-earth-light/20" />
          )}
        </div>
      </Link>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1">
          {product.tags?.map((tag) => (
            <Badge key={tag} variant="accent" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={`/produkty/${product.slug}`}
          className="mt-2 block font-display text-base font-semibold hover:text-sage sm:text-lg"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.short_description}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:mt-4">
          <div>
            <span className="font-semibold">{formatPrice(Number(product.price))}</span>
            {product.compare_at_price && (
              <>
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatPrice(Number(product.compare_at_price))}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nejnižší cena za posledních 30 dní:{" "}
                  {formatPrice(Number(product.compare_at_price))}
                </p>
              </>
            )}
          </div>
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={Number(product.price)}
            stockQuantity={product.stock_quantity}
            imageUrl={imageUrl}
            className="w-full sm:w-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
