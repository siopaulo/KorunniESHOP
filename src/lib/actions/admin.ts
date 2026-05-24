"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit/log";
import {
  canManageCatalog,
  canManageOrders,
  canManageSettings,
  requireAuth,
  requireRole,
} from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  blogPostSchema,
  categorySchema,
  legalPageSchema,
  orderUpdateSchema,
  productSchema,
  siteSettingsSchema,
  testimonialSchema,
} from "@/lib/validations/schemas";
import { notifyOrderShipped } from "@/lib/orders/fulfill";
import type { AdminRole } from "@/types/database";

export type ActionResult = { error?: string; success?: string };

function parseFormNumber(value: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseFormBool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

// ——— Products ———

export async function upsertProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const id = String(formData.get("id") ?? "") || undefined;
  const parsed = productSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") ?? "",
    shortDescription: formData.get("shortDescription") ?? "",
    price: parseFormNumber(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice")
      ? parseFormNumber(formData.get("compareAtPrice"))
      : null,
    stockQuantity: parseFormNumber(formData.get("stockQuantity")),
    lowStockThreshold: parseFormNumber(formData.get("lowStockThreshold"), 5),
    sku: formData.get("sku") || null,
    isActive: parseFormBool(formData.get("isActive")),
    isFeatured: parseFormBool(formData.get("isFeatured")),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
    weightGrams: formData.get("weightGrams")
      ? parseFormNumber(formData.get("weightGrams"))
      : null,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };
  }

  const supabase = await createClient();
  const payload = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    short_description: parsed.data.shortDescription,
    price: parsed.data.price,
    compare_at_price: parsed.data.compareAtPrice,
    stock_quantity: parsed.data.stockQuantity,
    low_stock_threshold: parsed.data.lowStockThreshold,
    sku: parsed.data.sku,
    is_active: parsed.data.isActive,
    is_featured: parsed.data.isFeatured,
    tags: parsed.data.tags,
    seo_title: parsed.data.seoTitle,
    seo_description: parsed.data.seoDescription,
    weight_grams: parsed.data.weightGrams,
  };

  const { data, error } = id
    ? await supabase.from("products").update(payload).eq("id", id).select("id").single()
    : await supabase.from("products").insert(payload).select("id").single();

  if (error) return { error: error.message };

  await writeAuditLog({
    userId: session.userId,
    action: id ? "product.update" : "product.create",
    entityType: "products",
    entityId: data?.id,
  });

  revalidatePath("/admin/produkty");
  revalidatePath("/produkty");
  return { success: id ? "Produkt aktualizován" : "Produkt vytvořen" };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  await writeAuditLog({
    userId: session.userId,
    action: "product.delete",
    entityType: "products",
    entityId: id,
  });

  revalidatePath("/admin/produkty");
  return { success: "Produkt smazán" };
}

// ——— Categories ———

export async function upsertCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const id = String(formData.get("id") ?? "") || undefined;
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") ?? "",
    imageUrl: formData.get("imageUrl") || null,
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
    sortOrder: parseFormNumber(formData.get("sortOrder")),
    isActive: parseFormBool(formData.get("isActive")),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl,
    seo_title: parsed.data.seoTitle,
    seo_description: parsed.data.seoDescription,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  };

  const { error } = id
    ? await supabase.from("product_categories").update(payload).eq("id", id)
    : await supabase.from("product_categories").insert(payload);

  if (error) return { error: error.message };

  await writeAuditLog({
    userId: session.userId,
    action: id ? "category.update" : "category.create",
    entityType: "product_categories",
    entityId: id,
  });

  revalidatePath("/admin/kategorie");
  revalidatePath("/");
  return { success: "Kategorie uložena" };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const supabase = await createClient();
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/kategorie");
  return { success: "Kategorie smazána" };
}

// ——— Orders ———

export async function updateOrderStatusAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageOrders(session.role) && session.role !== "admin") {
    return { error: "Nemáte oprávnění" };
  }

  const orderId = String(formData.get("orderId"));
  const parsed = orderUpdateSchema.safeParse({
    status: formData.get("status"),
    adminNote: formData.get("adminNote") || undefined,
  });

  if (!parsed.success) return { error: "Nevalidní stav objednávky" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: parsed.data.status,
      admin_note: parsed.data.adminNote ?? null,
    })
    .eq("id", orderId);

  if (error) return { error: error.message };

  if (parsed.data.status === "shipped") {
    await notifyOrderShipped(orderId);
  }

  await writeAuditLog({
    userId: session.userId,
    action: "order.status_update",
    entityType: "orders",
    entityId: orderId,
    metadata: { status: parsed.data.status },
  });

  revalidatePath("/admin/objednavky");
  revalidatePath(`/admin/objednavky/${orderId}`);
  return { success: "Stav objednávky aktualizován" };
}

// ——— Blog ———

export async function upsertBlogPostAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const id = String(formData.get("id") ?? "") || undefined;
  const status = formData.get("status") === "published" ? "published" : "draft";
  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content") ?? "",
    coverImageUrl: formData.get("coverImageUrl") || null,
    status,
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null,
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };

  const supabase = await createClient();
  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover_image_url: parsed.data.coverImageUrl,
    status: parsed.data.status,
    seo_title: parsed.data.seoTitle,
    seo_description: parsed.data.seoDescription,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
    author_id: session.userId,
  };

  const { error } = id
    ? await supabase.from("blog_posts").update(payload).eq("id", id)
    : await supabase.from("blog_posts").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin/novinky");
  revalidatePath("/novinky");
  return { success: "Článek uložen" };
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/novinky");
  return { success: "Článek smazán" };
}

// ——— Testimonials ———

export async function upsertTestimonialAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  const id = String(formData.get("id") ?? "") || undefined;
  const parsed = testimonialSchema.safeParse({
    authorName: formData.get("authorName"),
    content: formData.get("content"),
    rating: parseFormNumber(formData.get("rating"), 5),
    isActive: parseFormBool(formData.get("isActive")),
    isVerified: parseFormBool(formData.get("isVerified")),
    sortOrder: parseFormNumber(formData.get("sortOrder")),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };

  const supabase = await createClient();
  const payload = {
    author_name: parsed.data.authorName,
    content: parsed.data.content,
    rating: parsed.data.rating,
    is_active: parsed.data.isActive,
    is_verified: parsed.data.isVerified,
    sort_order: parsed.data.sortOrder,
  };

  const { error } = id
    ? await supabase.from("testimonials").update(payload).eq("id", id)
    : await supabase.from("testimonials").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin/reference");
  revalidatePath("/reference");
  return { success: "Reference uložena" };
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reference");
  return { success: "Reference smazána" };
}

// ——— Settings ———

export async function updateSiteSettingsAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireRole(["admin"]);
  if (!canManageSettings(session.role)) return { error: "Nemáte oprávnění" };

  const settingsId = String(formData.get("settingsId"));
  const parsed = siteSettingsSchema.safeParse({
    shopName: formData.get("shopName"),
    shopEmail: formData.get("shopEmail"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    ico: formData.get("ico") || null,
    dic: formData.get("dic") || null,
    bankAccount: formData.get("bankAccount") || null,
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };

  const flatRate = parseFormNumber(formData.get("flatRate"), 99);
  const freeShippingThreshold = parseFormNumber(formData.get("freeShippingThreshold"), 1500);

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      shop_name: parsed.data.shopName,
      shop_email: parsed.data.shopEmail,
      phone: parsed.data.phone,
      address: parsed.data.address,
      ico: parsed.data.ico,
      dic: parsed.data.dic,
      bank_account: parsed.data.bankAccount,
      shipping_config: { flatRate, freeShippingThreshold },
    })
    .eq("id", settingsId);

  if (error) return { error: error.message };

  revalidatePath("/admin/nastaveni");
  return { success: "Nastavení uloženo" };
}

// ——— Legal ———

export async function updateLegalPageAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = legalPageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    content: formData.get("content") ?? "",
  });

  if (!parsed.success) return { error: "Nevalidní data" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("legal_pages")
    .update({ title: parsed.data.title, content: parsed.data.content })
    .eq("slug", parsed.data.slug);

  if (error) return { error: error.message };

  revalidatePath("/admin/pravni-texty");
  return { success: "Právní text uložen" };
}

export async function deleteProductFormAction(formData: FormData): Promise<void> {
  await deleteProductAction(String(formData.get("id")));
}

export async function deleteCategoryFormAction(formData: FormData): Promise<void> {
  await deleteCategoryAction(String(formData.get("id")));
}

export async function updateAdminUserRoleAction(
  userId: string,
  role: AdminRole,
): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/uzivatele");
  return { success: "Role aktualizována" };
}
