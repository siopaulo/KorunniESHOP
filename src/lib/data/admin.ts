import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getAdminProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data;
}

export async function getAdminCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAdminOrders(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, customers(email, first_name, last_name)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return data ?? [];
}

export async function getAdminOrder(id: string) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .eq("id", id)
    .single();
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", id);
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("order_id", id);
  return { order, items: items ?? [], payments: payments ?? [], invoices: invoices ?? [] };
}

export async function getAdminBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAdminSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").limit(1).single();
  return data;
}

export async function getAdminLegalPages() {
  const supabase = await createClient();
  const { data } = await supabase.from("legal_pages").select("*").order("slug");
  return data ?? [];
}

export async function getAdminUsers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getDashboardMetrics() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [products, lowStock, ordersToday, paidOrders, recentOrders] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("stock_quantity, low_stock_threshold"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`),
    supabase.from("orders").select("total, created_at").eq("status", "paid"),
    supabase
      .from("orders")
      .select("id, order_number, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const lowStockCount =
    lowStock.data?.filter((p) => p.stock_quantity <= p.low_stock_threshold).length ?? 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  const revenueMonth = (paidOrders.data ?? [])
    .filter((o) => new Date(o.created_at) >= monthStart)
    .reduce((sum, o) => sum + Number(o.total), 0);

  return {
    productCount: products.count ?? 0,
    lowStockCount,
    ordersToday: ordersToday.count ?? 0,
    revenueMonth,
    recentOrders: recentOrders.data ?? [],
  };
}
