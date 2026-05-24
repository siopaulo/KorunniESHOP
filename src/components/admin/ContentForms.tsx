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

import { LEGAL_PAGE_LABELS, type LegalSlug } from "@/lib/legal/default-content";

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

      <div className="space-y-2">

        <Label htmlFor={`title-${post?.id ?? "new"}`}>Název článku</Label>

        <Input

          id={`title-${post?.id ?? "new"}`}

          name="title"

          defaultValue={post?.title}

          required

        />

      </div>

      <div className="space-y-2">

        <Label htmlFor={`slug-${post?.id ?? "new"}`}>Adresa článku</Label>

        <Input

          id={`slug-${post?.id ?? "new"}`}

          name="slug"

          defaultValue={post?.slug}

          placeholder="jak-sbirat-byliny"

        />

        <p className="text-xs text-muted-foreground">

          Krátký text v adrese, například jak-sbirat-byliny

        </p>

      </div>

      <div className="space-y-2">

        <Label htmlFor={`excerpt-${post?.id ?? "new"}`}>Krátký úvod článku</Label>

        <Textarea

          id={`excerpt-${post?.id ?? "new"}`}

          name="excerpt"

          defaultValue={post?.excerpt}

          rows={2}

        />

        <p className="text-xs text-muted-foreground">

          Zobrazí se v přehledu novinek a ve sdílení.

        </p>

      </div>

      <div className="space-y-2">

        <Label htmlFor={`content-${post?.id ?? "new"}`}>Obsah článku</Label>

        <Textarea

          id={`content-${post?.id ?? "new"}`}

          name="content"

          rows={8}

          defaultValue={post?.content}

        />

      </div>

      <div className="space-y-2">

        <Label htmlFor={`status-${post?.id ?? "new"}`}>Stav</Label>

        <select

          id={`status-${post?.id ?? "new"}`}

          name="status"

          defaultValue={post?.status ?? "draft"}

          className="h-10 w-full rounded-lg border px-3"

        >

          <option value="draft">Koncept</option>

          <option value="published">Publikováno</option>

        </select>

      </div>

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

    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">

      <input type="hidden" name="settingsId" value={settings.id} />

      <div className="space-y-2">

        <Label htmlFor="shopName">Název obchodu</Label>

        <Input id="shopName" name="shopName" defaultValue={settings.shop_name} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="shopEmail">E-mail obchodu</Label>

        <Input id="shopEmail" name="shopEmail" type="email" defaultValue={settings.shop_email} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="phone">Telefon</Label>

        <Input id="phone" name="phone" defaultValue={settings.phone} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="address">Adresa</Label>

        <Textarea id="address" name="address" defaultValue={settings.address} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="ico">IČO</Label>

        <Input id="ico" name="ico" defaultValue={settings.ico ?? ""} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="dic">DIČ</Label>

        <Input id="dic" name="dic" defaultValue={settings.dic ?? ""} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="bankAccount">Bankovní účet</Label>

        <Input id="bankAccount" name="bankAccount" defaultValue={settings.bank_account ?? ""} />

      </div>

      <div className="space-y-2">

        <Label htmlFor="flatRate">Cena dopravy (Kč)</Label>

        <Input

          id="flatRate"

          name="flatRate"

          type="number"

          defaultValue={settings.shipping_config?.flatRate ?? 99}

        />

      </div>

      <div className="space-y-2">

        <Label htmlFor="freeShippingThreshold">Doprava zdarma od (Kč)</Label>

        <Input

          id="freeShippingThreshold"

          name="freeShippingThreshold"

          type="number"

          defaultValue={settings.shipping_config?.freeShippingThreshold ?? 1500}

        />

      </div>

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



  const slugLabel =

    page.slug in LEGAL_PAGE_LABELS

      ? LEGAL_PAGE_LABELS[page.slug as LegalSlug]

      : page.slug;



  return (

    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">

      <input type="hidden" name="slug" value={page.slug} />

      <p className="text-sm font-medium text-muted-foreground">{slugLabel}</p>

      <div className="space-y-2">

        <Label htmlFor={`legal-title-${page.slug}`}>Nadpis stránky</Label>

        <Input id={`legal-title-${page.slug}`} name="title" defaultValue={page.title} />

      </div>

      <div className="space-y-2">

        <Label htmlFor={`legal-content-${page.slug}`}>Obsah</Label>

        <Textarea

          id={`legal-content-${page.slug}`}

          name="content"

          rows={14}

          defaultValue={page.content}

          className="font-mono text-sm"

        />

      </div>

      <Button type="submit" disabled={pending}>

        Uložit

      </Button>

    </form>

  );

}

