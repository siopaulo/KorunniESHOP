"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import {
  upsertBlogPostAction,
  upsertTestimonialAction,
  updateSiteSettingsAction,
  updateLegalPageAction,
  type ActionResult,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPostRow, TestimonialRow } from "@/types/admin-content";

const initial: ActionResult = {};

export function BlogPostForm({ post }: { post?: BlogPostRow }) {
  const [state, action, pending] = useActionState(upsertBlogPostAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <Input name="title" placeholder="Název" defaultValue={post?.title} required />
      <Input name="slug" placeholder="slug" defaultValue={post?.slug} />
      <Textarea name="excerpt" placeholder="Perex" defaultValue={post?.excerpt} />
      <Textarea name="content" placeholder="Obsah" rows={8} defaultValue={post?.content} />
      <select name="status" defaultValue={post?.status ?? "draft"} className="h-10 w-full rounded-lg border px-3">
        <option value="draft">Koncept</option>
        <option value="published">Publikováno</option>
      </select>
      <Button type="submit" disabled={pending}>
        Uložit článek
      </Button>
    </form>
  );
}

export function TestimonialForm({ item }: { item?: TestimonialRow }) {
  const [state, action, pending] = useActionState(upsertTestimonialAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <Input name="authorName" placeholder="Jméno" defaultValue={item?.author_name} required />
      <Textarea name="content" placeholder="Text reference" defaultValue={item?.content} required />
      <Input name="rating" type="number" min={1} max={5} defaultValue={item?.rating ?? 5} />
      <Button type="submit" disabled={pending}>
        Uložit referenci
      </Button>
    </form>
  );
}

export function SiteSettingsForm({
  settings,
}: {
  settings: {
    id: string;
    shop_name: string;
    shop_email: string;
    phone: string;
    address: string;
    ico?: string | null;
    dic?: string | null;
    bank_account?: string | null;
    shipping_config?: { flatRate?: number; freeShippingThreshold?: number };
  };
}) {
  const [state, action, pending] = useActionState(updateSiteSettingsAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
      <input type="hidden" name="settingsId" value={settings.id} />
      <Input name="shopName" defaultValue={settings.shop_name} placeholder="Název obchodu" />
      <Input name="shopEmail" type="email" defaultValue={settings.shop_email} />
      <Input name="phone" defaultValue={settings.phone} />
      <Textarea name="address" defaultValue={settings.address} />
      <Input name="ico" defaultValue={settings.ico ?? ""} placeholder="IČO" />
      <Input name="dic" defaultValue={settings.dic ?? ""} placeholder="DIČ" />
      <Input name="bankAccount" defaultValue={settings.bank_account ?? ""} />
      <Input
        name="flatRate"
        type="number"
        defaultValue={settings.shipping_config?.flatRate ?? 99}
        placeholder="Doprava CZK"
      />
      <Input
        name="freeShippingThreshold"
        type="number"
        defaultValue={settings.shipping_config?.freeShippingThreshold ?? 1500}
        placeholder="Doprava zdarma od"
      />
      <Button type="submit" disabled={pending}>
        Uložit nastavení
      </Button>
    </form>
  );
}

export function LegalPageForm({
  page,
}: {
  page: { slug: string; title: string; content: string };
}) {
  const [state, action, pending] = useActionState(updateLegalPageAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <input type="hidden" name="slug" value={page.slug} />
      <Label>{page.slug}</Label>
      <Input name="title" defaultValue={page.title} />
      <Textarea name="content" rows={12} defaultValue={page.content} />
      <Button type="submit" disabled={pending}>
        Uložit
      </Button>
    </form>
  );
}
