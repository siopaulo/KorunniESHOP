# Audit fází 1–4 (květen 2026)

Přehled skutečného stavu projektu **Korunní Byliny** — co funguje, co je rozpracované, co chybí.

---

## Fáze 1 — Architektura a základy ✅ hotovo

| Oblast | Stav |
|--------|------|
| Next.js 15, TS, Tailwind 4, shadcn/ui | ✅ |
| Design systém (barvy, fonty) | ✅ |
| Route groups `(public)` / `(admin)` | ✅ |
| Header, Footer, homepage sekce | ✅ |
| `.env.example`, README, docs | ✅ |
| Build / lint | ✅ (po fázi 4) |

---

## Fáze 2 — Databáze, auth, security ✅ hotovo

| Oblast | Stav |
|--------|------|
| Supabase migrace + seed | ✅ |
| RLS, triggery, order_number | ✅ |
| Supabase klienti + middleware auth | ✅ |
| Admin login, role (admin/editor/orders_only) | ✅ |
| Zod validace, audit log, Sentry | ✅ |
| Lokální ověření s reálným projektem | ✅ (uživatel) |

---

## Fáze 3 — Frontend e-shop ⚠️ částečně

**Hotovo:**
- Header s košíkem, homepage (hero, kategorie z DB, benefity, příběh)
- Katalog `/produkty` s „Do košíku“
- **Detail produktu** `/produkty/[slug]` — galerie, cena, množství, košík, JSON-LD
- **Kategorie** `/kategorie/[slug]` — produkty z DB
- Košík `/kosik`, pokladna `/pokladna`
- Kontakt s formulářem + e-mail
- Právní stránky (dynamic z DB — pokud seed běžel)
- `sitemap.ts` existuje

**Chybí / placeholder:**
- Blog `/novinky` — jen nadpis, bez seznamu z DB
- Reference `/reference` — jen nadpis
- O nás `/o-nas` — jen nadpis (obsah z settings ne)
- Filtry a řazení v katalogu
- Pagination / infinite scroll
- Cookie consent banner
- Featured produkty na homepage z DB
- Newsletter, animace scroll (Framer Motion minimálně)
- Vlastní 404 / error stránky (design)
- OG obrázky per produkt

**Závěr:** Fáze 3 **není kompletní** — core nákup funguje, obsahové stránky a SEO doplňky chybí.

---

## Fáze 4 — Admin, platby, e-maily ⚠️ téměř hotovo

**Hotovo:**
- Admin dashboard, CRUD produkty/kategorie/objednávky/blog/reference/nastavení/právní texty/uživatelé
- Stripe checkout + webhook + fulfill (sklad, faktura, e-maily)
- Resend e-maily (objednávka, admin, odesláno, kontakt)
- Manual invoice provider
- **Upload fotek produktů přes Cloudinary** (admin → upravit produkt → sekce Fotografie)
- GoPay placeholder

**Chybí:**
- Editor obsahu homepage/footer v adminu (`/admin/obsah` — odstraněno, nahrazeno právními texty)
- React Email šablony (HTML inline)
- Rate limit na checkout
- Cloudinary u kategorií (jen URL pole)

---

## Co dělat před fází 5

1. **Footer** — opraveno (sticky layout `flex min-h-screen`)
2. **Fotky produktů** — nahrát v adminu po uložení produktu; vyžaduje `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
   + `npm install` (balíček `cloudinary`) + restart dev serveru
3. **SKU** — volitelný interní kód skladu (Stock Keeping Unit), zákazník ho nevidí
4. Doplnit fázi 3: blog, reference, o nás z DB
5. Cookie banner + testy (fáze 5)

---

## Rychlý test fotek

1. Admin → Produkty → Upravit (např. mýdlo kopřiva + jíl)
2. Sekce **Fotografie produktu** → vybrat JPG/PNG → Nahrát
3. Veřejně `/produkty/mydlo-kopriva-jil` — galerie by se měla zobrazit

Pokud upload selže: zkontrolujte Cloudinary dashboard (API key aktivní) a restart `npm run dev`.
