import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getTestimonials() {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getTestimonials]", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPublishedBlogPosts(limit?: number) {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("[getPublishedBlogPosts]", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPublishedBlogPostBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getLegalPageBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legal_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

const LEGAL_SLUG_MAP: Record<string, string> = {
  terms: "obchodni-podminky",
  privacy: "ochrana-osobnich-udaju",
  cookies: "cookies",
  returns: "reklamacni-rad",
  withdrawal: "odstoupeni-od-smlouvy",
};

export function routeToLegalSlug(pathname: string): string | null {
  const entry = Object.entries(LEGAL_SLUG_MAP).find(([, route]) =>
    pathname.includes(route.replace(/\//g, "")),
  );
  if (entry) return entry[0];
  if (pathname.includes("obchodni-podminky")) return "terms";
  if (pathname.includes("ochrana-osobnich")) return "privacy";
  if (pathname.includes("cookies")) return "cookies";
  if (pathname.includes("reklamacni")) return "returns";
  if (pathname.includes("odstoupeni")) return "withdrawal";
  return null;
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();

  if (error) return null;
  return data;
}

export async function getDashboardStats() {
  if (!isSupabaseConfigured()) {
    return { productCount: 0, lowStockCount: 0, orderCount: 0, ordersToday: 0 };
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [products, lowStock, orders, ordersToday] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("stock_quantity, low_stock_threshold"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`),
  ]);

  const lowStockCount =
    lowStock.data?.filter((p) => p.stock_quantity <= p.low_stock_threshold).length ?? 0;

  return {
    productCount: products.count ?? 0,
    lowStockCount,
    orderCount: orders.count ?? 0,
    ordersToday: ordersToday.count ?? 0,
  };
}
