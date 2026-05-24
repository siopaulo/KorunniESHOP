"use client";

import { toast } from "sonner";

import { deleteProductAction } from "@/lib/actions/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface DeleteProductButtonProps {
  id: string;
  name?: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  return (
    <ConfirmDialog
      title="Smazat produkt?"
      description={
        name
          ? `Opravdu chcete smazat „${name}“? Tuto akci nelze vrátit.`
          : "Opravdu chcete smazat tento produkt? Tuto akci nelze vrátit."
      }
      onConfirm={async () => {
        const result = await deleteProductAction(id);
        if (result.error) toast.error(result.error);
        else toast.success(result.success ?? "Produkt smazán");
      }}
    >
      <Button type="button" variant="destructive" size="sm">
        Smazat produkt
      </Button>
    </ConfirmDialog>
  );
}
