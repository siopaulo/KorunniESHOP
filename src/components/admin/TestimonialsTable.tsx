"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteTestimonialAction,
  upsertTestimonialAction,
} from "@/lib/actions/admin";
import { formatDateCs, cn } from "@/lib/utils";

export interface AdminTestimonialRow {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  is_active: boolean;
  is_verified?: boolean;
  sort_order: number;
  created_at: string;
}

type StatusFilter = "all" | "active" | "hidden";

export function TestimonialsTable({ rows }: { rows: AdminTestimonialRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AdminTestimonialRow>>({});
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (status === "active" && !r.is_active) return false;
      if (status === "hidden" && r.is_active) return false;
      if (!q) return true;
      return (
        r.author_name.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)
      );
    });
  }, [rows, search, status]);

  function startEdit(row: AdminTestimonialRow) {
    setEditingId(row.id);
    setDraft({ ...row });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
    setCreating(false);
  }

  async function saveRow(id?: string) {
    const fd = new FormData();
    if (id) fd.set("id", id);
    fd.set("authorName", String(draft.author_name ?? ""));
    fd.set("content", String(draft.content ?? ""));
    fd.set("rating", String(draft.rating ?? 5));
    fd.set("sortOrder", String(draft.sort_order ?? 0));
    if (draft.is_active) fd.set("isActive", "on");
    if (draft.is_verified) fd.set("isVerified", "on");

    const res = await upsertTestimonialAction({}, fd);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success);
      cancelEdit();
      startTransition(() => router.refresh());
    }
  }

  async function remove(id: string) {
    const res = await deleteTestimonialAction(id);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success);
      startTransition(() => router.refresh());
    }
  }

  async function toggleActive(row: AdminTestimonialRow) {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("authorName", row.author_name);
    fd.set("content", row.content);
    fd.set("rating", String(row.rating));
    fd.set("sortOrder", String(row.sort_order));
    if (!row.is_active) fd.set("isActive", "on");
    if (row.is_verified) fd.set("isVerified", "on");

    const res = await upsertTestimonialAction({}, fd);
    if (res.error) toast.error(res.error);
    else startTransition(() => router.refresh());
  }

  if (rows.length === 0 && !creating) {
    return (
      <AdminEmptyState
        title="Zatím žádné reference"
        description="Přidejte první referenci zákazníka."
        action={
          <Button onClick={() => setCreating(true)} type="button">
            Nová reference
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Vše"],
              ["active", "Aktivní"],
              ["hidden", "Skryté"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                "h-9 rounded-full border px-3 text-sm",
                status === key
                  ? "border-sage bg-sage text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat…"
            className="max-w-xs"
          />
          <Button type="button" onClick={() => { setCreating(true); setDraft({ rating: 5, is_active: true, sort_order: 0 }); }}>
            Nová reference
          </Button>
        </div>
      </div>

      {creating ? (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Nová reference</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Jméno autora</Label>
              <Input
                value={draft.author_name ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, author_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pořadí</Label>
              <Input
                type="number"
                value={draft.sort_order ?? 0}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, sort_order: Number(e.target.value) || 0 }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Text reference</Label>
            <Textarea
              rows={4}
              value={draft.content ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
            />
          </div>
          <StarRating
            value={draft.rating ?? 5}
            onChange={(v) => setDraft((d) => ({ ...d, rating: v }))}
          />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={draft.is_active ?? true}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, is_active: v === true }))}
              />
              Aktivní (veřejně)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={draft.is_verified ?? false}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, is_verified: v === true }))}
              />
              Ověřený zákazník
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => saveRow()}>
              <Save className="h-4 w-4" /> Uložit
            </Button>
            <Button type="button" variant="outline" onClick={cancelEdit}>
              <X className="h-4 w-4" /> Zrušit
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Autor</th>
              <th className="px-5 py-3">Hodnocení</th>
              <th className="hidden px-5 py-3 md:table-cell">Text</th>
              <th className="px-5 py-3">Stav</th>
              <th className="hidden px-5 py-3 lg:table-cell">Datum</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((row) => (
              <Fragment key={row.id}>
                <tr
                  className={cn(
                    "hover:bg-muted/30",
                    editingId !== row.id && "cursor-pointer",
                  )}
                  onClick={() => editingId !== row.id && startEdit(row)}
                >
                  <td className="px-5 py-3 font-medium">
                    {row.author_name}
                    {row.is_verified ? (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Ověřený
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    <StarRating value={row.rating} size="sm" />
                  </td>
                  <td className="hidden max-w-md truncate px-5 py-3 md:table-cell">{row.content}</td>
                  <td className="px-5 py-3">
                    <Badge variant={row.is_active ? "default" : "outline"}>
                      {row.is_active ? "Aktivní" : "Skrytá"}
                    </Badge>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {formatDateCs(row.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => toggleActive(row)}>
                        {row.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <ConfirmDialog
                        title="Smazat referenci?"
                        description="Reference bude trvale odstraněna."
                        onConfirm={() => remove(row.id)}
                      >
                        <Button size="icon" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmDialog>
                    </div>
                  </td>
                </tr>
                {editingId === row.id ? (
                  <tr className="bg-muted/20">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Jméno autora</Label>
                          <Input
                            value={draft.author_name ?? ""}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, author_name: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pořadí zobrazení</Label>
                          <Input
                            type="number"
                            value={draft.sort_order ?? 0}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                sort_order: Number(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>Text reference</Label>
                        <Textarea
                          rows={4}
                          value={draft.content ?? ""}
                          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                        />
                      </div>
                      <div className="mt-4">
                        <StarRating
                          value={draft.rating ?? 5}
                          onChange={(v) => setDraft((d) => ({ ...d, rating: v }))}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={draft.is_active ?? false}
                            onCheckedChange={(v) =>
                              setDraft((d) => ({ ...d, is_active: v === true }))
                            }
                          />
                          Aktivní
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={draft.is_verified ?? false}
                            onCheckedChange={(v) =>
                              setDraft((d) => ({ ...d, is_verified: v === true }))
                            }
                          />
                          Ověřený zákazník
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button type="button" onClick={() => saveRow(row.id)}>
                          <Save className="h-4 w-4" /> Uložit
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelEdit}>
                          Zrušit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
