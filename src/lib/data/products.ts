import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CategoryRow, ProductRow } from "@/types/database";

export type { ProductImage, ProductWithCategory } from "@/lib/data/product-types";
export { getPrimaryImageUrl } from "@/lib/data/product-types";

import type { ProductImage, ProductWithCategory } from "@/lib/data/product-types";

export async function getCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getCategories]", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, url, alt_text, is_primary, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getProductImages]", error.message);
    return [];
  }

  return data ?? [];
}

async function attachImages<T extends { id: string }>(
  products: T[],
): Promise<(T & { images: ProductImage[] })[]> {
  if (products.length === 0) return [];

  const supabase = await createClient();
  const ids = products.map((p) => p.id);
  const { data } = await supabase
    .from("product_images")
    .select("id, product_id, url, alt_text, is_primary, sort_order")
    .in("product_id", ids)
    .order("sort_order", { ascending: true });

  const byProduct = new Map<string, ProductImage[]>();
  for (const row of data ?? []) {
    const list = byProduct.get(row.product_id) ?? [];
    list.push({
      id: row.id,
      url: row.url,
      alt_text: row.alt_text,
      is_primary: row.is_primary,
      sort_order: row.sort_order,
    });
    byProduct.set(row.product_id, list);
  }

  return products.map((product) => ({
    ...product,
    images: byProduct.get(product.id) ?? [],
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, product_categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getProducts]", error.message);
    return [];
  }

  let products = (data ?? []).map((row) => {
    const { product_categories: category, ...product } = row as ProductRow & {
      product_categories: CategoryRow | null;
    };
    return { ...product, category: category ?? undefined };
  });

  if (options?.categorySlug) {
    products = products.filter((p) => p.category?.slug === options.categorySlug);
  }

  return attachImages(products);
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;

  const { product_categories: category, ...product } = data as ProductRow & {
    product_categories: CategoryRow | null;
  };

  const images = await getProductImages(product.id);

  return {
    ...product,
    category: category ?? undefined,
    images,
  };
}

export async function getProductCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}

export async function getLowStockCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("stock_quantity, low_stock_threshold");

  if (error || !data) return 0;

  return data.filter((p) => p.stock_quantity <= p.low_stock_threshold).length;
}
