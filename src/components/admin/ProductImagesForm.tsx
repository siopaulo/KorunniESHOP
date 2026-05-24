"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  deleteProductImageAction,
  setPrimaryProductImageAction,
  uploadProductImageAction,
} from "@/lib/actions/product-images";
import type { ActionResult } from "@/lib/actions/admin";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionResult = {};

export interface ProductImageRow {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductImagesFormProps {
  productId: string;
  productName: string;
  images: ProductImageRow[];
  cloudinaryConfigured: boolean;
}

export function ProductImagesForm({
  productId,
  productName,
  images,
  cloudinaryConfigured,
}: ProductImagesFormProps) {
  const [state, uploadAction, uploading] = useActionState(uploadProductImageAction, initial);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Fotografie produktu</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nahrajte fotky produktu (JPG, PNG, WebP, max. 5 MB). První fotka bude hlavní.
        </p>
      </div>

      {!cloudinaryConfigured && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Cloudinary není nakonfigurováno. Doplňte do <code>.env.local</code> proměnné{" "}
          <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> a{" "}
          <code>CLOUDINARY_API_SECRET</code>, pak restartujte dev server.
        </p>
      )}

      <form action={uploadAction} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <div className="space-y-2">
          <Label htmlFor="product-image">Nový obrázek</Label>
          <Input
            ref={fileRef}
            id="product-image"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={!cloudinaryConfigured}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altText">Popis obrázku (volitelné)</Label>
          <Input
            id="altText"
            name="altText"
            placeholder={productName}
            disabled={!cloudinaryConfigured}
          />
        </div>
        <Button type="submit" disabled={uploading || !cloudinaryConfigured}>
          {uploading ? "Nahrávám…" : "Nahrát fotku"}
        </Button>
      </form>

      {images.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <li key={image.id} className="overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-square bg-muted">
                <CloudinaryImage
                  src={image.url}
                  alt={image.alt_text}
                  fill
                  crop="fill"
                  sizes="200px"
                />
                {image.is_primary && (
                  <span className="absolute left-2 top-2 rounded bg-sage px-2 py-0.5 text-xs text-white">
                    Hlavní
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 p-3">
                {!image.is_primary && (
                  <form action={setPrimaryProductImageAction}>
                    <input type="hidden" name="imageId" value={image.id} />
                    <input type="hidden" name="productId" value={productId} />
                    <Button type="submit" size="sm" variant="outline">
                      Nastavit jako hlavní
                    </Button>
                  </form>
                )}
                <form action={deleteProductImageAction}>
                  <input type="hidden" name="imageId" value={image.id} />
                  <input type="hidden" name="productId" value={productId} />
                  <Button type="submit" size="sm" variant="destructive">
                    Smazat
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
