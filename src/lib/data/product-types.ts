/** Sdílené typy a helpery produktů — bez server-only (bezpečné pro client komponenty). */

import type { CategoryRow, ProductRow } from "@/types/database";

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export type ProductWithCategory = ProductRow & {
  category?: CategoryRow;
  images?: ProductImage[];
};

export function getPrimaryImageUrl(images?: ProductImage[]): string | undefined {
  if (!images?.length) return undefined;
  const primary = images.find((i) => i.is_primary) ?? images[0];
  return primary?.url;
}
