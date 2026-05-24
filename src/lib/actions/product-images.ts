"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit/log";
import { canManageCatalog, requireAuth } from "@/lib/auth/session";
import { deleteCloudinaryImage, uploadProductImage } from "@/lib/cloudinary/upload";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadProductImageAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return { error: "Nemáte oprávnění" };

  if (!isCloudinaryConfigured()) {
    return {
      error:
        "Cloudinary není nakonfigurováno. Zkontrolujte NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY a CLOUDINARY_API_SECRET v .env.local",
    };
  }

  const productId = String(formData.get("productId") ?? "");
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();

  if (!productId) return { error: "Chybí ID produktu" };
  if (!(file instanceof File) || file.size === 0) return { error: "Vyberte obrázek" };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Povolené formáty: JPG, PNG, WebP, GIF" };
  }
  if (file.size > MAX_FILE_SIZE) return { error: "Maximální velikost je 5 MB" };

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, name")
    .eq("id", productId)
    .single();

  if (!product) return { error: "Produkt nenalezen" };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadProductImage(buffer, productId);

    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const isPrimary = (count ?? 0) === 0;

    const { error } = await supabase.from("product_images").insert({
      product_id: productId,
      url,
      public_id: publicId,
      alt_text: altText || product.name,
      sort_order: count ?? 0,
      is_primary: isPrimary,
    });

    if (error) return { error: error.message };

    await writeAuditLog({
      userId: session.userId,
      action: "product_image.create",
      entityType: "product_images",
      entityId: productId,
    });

    revalidatePath(`/admin/produkty/${productId}`);
    revalidatePath("/produkty");
    return { success: "Fotka nahrána" };
  } catch (err) {
    console.error("[uploadProductImageAction]", err);
    return { error: "Nahrání se nezdařilo. Zkontrolujte CLOUDINARY_API_SECRET (bez mezer) v .env.local." };
  }
}

export async function deleteProductImageAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return;

  const imageId = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!imageId) return;

  const supabase = await createClient();
  const { data: image } = await supabase
    .from("product_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!image) return;

  if (image.public_id && isCloudinaryConfigured()) {
    try {
      await deleteCloudinaryImage(image.public_id);
    } catch (err) {
      console.error("[deleteProductImageAction] cloudinary", err);
    }
  }

  await supabase.from("product_images").delete().eq("id", imageId);

  if (image.is_primary) {
    const { data: next } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", image.product_id)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (next) {
      await supabase.from("product_images").update({ is_primary: true }).eq("id", next.id);
    }
  }

  await writeAuditLog({
    userId: session.userId,
    action: "product_image.delete",
    entityType: "product_images",
    entityId: imageId,
  });

  revalidatePath(`/admin/produkty/${productId}`);
  revalidatePath("/produkty");
}

export async function setPrimaryProductImageAction(formData: FormData): Promise<void> {
  const session = await requireAuth();
  if (!canManageCatalog(session.role)) return;

  const imageId = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!imageId || !productId) return;

  const supabase = await createClient();
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);

  revalidatePath(`/admin/produkty/${productId}`);
  revalidatePath("/produkty");
}
