export interface DiscountInfo {
  hasDiscount: boolean;
  discountAmount: number;
  discountPercent: number;
}

/** Výpočet slevy z původní (compare-at) a prodejní ceny. */
export function calculateDiscount(
  price: number,
  compareAtPrice: number | null | undefined,
): DiscountInfo {
  if (
    compareAtPrice == null ||
    compareAtPrice <= 0 ||
    compareAtPrice <= price
  ) {
    return { hasDiscount: false, discountAmount: 0, discountPercent: 0 };
  }

  const discountAmount = compareAtPrice - price;
  const discountPercent = Math.round((discountAmount / compareAtPrice) * 100);

  return {
    hasDiscount: true,
    discountAmount,
    discountPercent,
  };
}
