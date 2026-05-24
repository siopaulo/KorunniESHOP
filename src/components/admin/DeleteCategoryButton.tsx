"use client";

import { toast } from "sonner";

import { deleteCategoryAction } from "@/lib/actions/admin";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  return (
    <ConfirmDialog
      title="Smazat kategorii?"
      description={`Opravdu chcete smazat kategorii „${name}“? Produkty v kategorii musí být nejdříve přeřazeny nebo smazány.`}
      onConfirm={async () => {
        const result = await deleteCategoryAction(id);
        if (result.error) toast.error(result.error);
        else toast.success(result.success ?? "Kategorie smazána");
      }}
    >
      <Button type="button" variant="destructive" size="sm">
        Smazat
      </Button>
    </ConfirmDialog>
  );
}
