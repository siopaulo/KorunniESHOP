"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import { upsertCategoryAction, type ActionResult } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CategoryRow } from "@/types/database";

const initial: ActionResult = {};

export function CategoryForm({ category }: { category?: CategoryRow }) {
  const [state, action, pending] = useActionState(upsertCategoryAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-border bg-card p-6">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Název</Label>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Adresa v URL</Label>
        <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="bylinna-mydla" />
        <p className="text-xs text-muted-foreground">Krátký text v adrese stránky kategorie</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Popis</Label>
        <Textarea id="description" name="description" defaultValue={category?.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL obrázku</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={category?.image_url ?? ""} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={category?.is_active ?? true} />
        <Label htmlFor="isActive">Aktivní</Label>
      </div>
      <Button type="submit" disabled={pending}>
        Uložit kategorii
      </Button>
    </form>
  );
}
