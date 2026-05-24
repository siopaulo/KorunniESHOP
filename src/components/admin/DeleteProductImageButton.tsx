"use client";

import { toast } from "sonner";

import { deleteProductImageAction } from "@/lib/actions/product-images";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface DeleteProductImageButtonProps {
  imageId: string;
  productId: string;
}

export function DeleteProductImageButton({ imageId, productId }: DeleteProductImageButtonProps) {
  return (
    <ConfirmDialog
      title="Smazat fotografii?"
      description="Fotografie bude odstraněna z produktu a z Cloudinary."
      onConfirm={async () => {
        const formData = new FormData();
        formData.set("imageId", imageId);
        formData.set("productId", productId);
        await deleteProductImageAction(formData);
        toast.success("Fotografie smazána");
      }}
    >
      <Button type="button" size="sm" variant="destructive">
        Smazat
      </Button>
    </ConfirmDialog>
  );
}
