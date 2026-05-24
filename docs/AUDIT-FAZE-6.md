# Audit fáze 6 — refactor podle EsterkyGalerie

> Datum: 2026-05-24  
> Reference: `/home/pavli/MamkyWEB/EsterkyGalerie` (lokální, `.gitignore`)

---

## Shrnutí

Fáze 6 dokončena v plném rozsahu kroků 6.1–6.4. E-shop získal konzistentní admin UX inspirovaný referencí, veřejné stránky obsahu napojené na Supabase a cookie lištu. Galerijní logika, branding Esterky a routes `/studio` nebyly přeneseny.

---

## Krok 6.1 — Confirm dialogy ✅

| Soubor | Popis |
|--------|-------|
| `src/components/ui/alert-dialog.tsx` | Radix AlertDialog (shadcn) |
| `src/components/admin/ConfirmDialog.tsx` | Reusable confirm s loading stavem |
| `DeleteProductButton`, `DeleteCategoryButton`, `DeleteProductImageButton` | Destruktivní akce s potvrzením |

**Pattern z reference:** `EsterkyGalerie/components/admin/confirm-dialog.tsx`

---

## Krok 6.2 — Admin navigace, hlavičky, skeletony ✅

| Soubor | Popis |
|--------|-------|
| `src/lib/admin-nav.ts` | Sdílená konfigurace admin menu |
| `src/components/admin/AdminNavLinks.tsx` | Aktivní stav + filtrování podle role |
| `src/components/admin/AdminMobileNav.tsx` | Sheet menu, zavření po navigaci |
| `src/components/admin/AdminPageHeader.tsx` | Jednotná hlavička stránek (breadcrumbs, akce) |
| `src/components/admin/AdminEmptyState.tsx` | Prázdný stav tabulek |
| `src/components/admin/AdminTableSkeleton.tsx` | Loading skeleton |
| `src/components/ui/skeleton.tsx` | UI skeleton |
| `loading.tsx` | Dashboard, produkty, objednávky |

**Oprava rolí:** Editor nevidí položku Objednávky (soulad s `canAccessAdminRoute`).

---

## Krok 6.3 — Admin tabulky a stránky ✅

| Soubor | Popis |
|--------|-------|
| `ProductsAdminTable.tsx` | Desktop tabulka + mobilní karty + search |
| `OrdersAdminTable.tsx` | Filtry stavu + mobilní karty |
| `src/lib/order-status-labels.ts` | Sdílené české popisky stavů |
| Všechny admin `page.tsx` | Napojeno na `AdminPageHeader` |

**Pattern z reference:** `admin-table-skeleton.tsx`, responzivní tabulky (`messages-table.tsx` princip)

---

## Krok 6.4 — Veřejný obsah z DB + cookie banner ✅

| Route / soubor | Zdroj dat |
|----------------|-----------|
| `/novinky` | `getPublishedBlogPosts()` |
| `/novinky/[slug]` | `getPublishedBlogPostBySlug()` |
| `/reference` | `getTestimonials()` |
| `/o-nas` | `getSiteSettings()` → `homepage_content` |
| `CookieBanner.tsx` | localStorage souhlas |

---

## Co jsme záměrně nepřenesli

- Lightbox, photo-grid, `/galerie`, `/studio`
- Block editor, hero carousel z reference
- 1:1 kopie textů nebo brandingu Esterky
- Fáze 5 (Lighthouse, deploy, automatické testy)

---

## Build / lint / typecheck

| Příkaz | Výsledek |
|--------|----------|
| `npm run typecheck` | ✅ exit 0 |
| `npm run lint` | ✅ „No ESLint warnings or errors“ |
| `npm run build` | ✅ exit 0 (Next.js 15.5.18) |

Nové routes v buildu: `/novinky`, `/novinky/[slug]`, `/reference`, `/o-nas` (dynamic), admin loading skeletony.

---

## Manuální test checklist

### Veřejný web (localhost:3001)

- [ ] `/novinky` — seznam článků ze seed (min. 1 článek)
- [ ] `/novinky/jak-sbirat-byliny-v-korunni` — detail článku
- [ ] `/reference` — 3 reference ze seed
- [ ] `/o-nas` — text z `site_settings.homepage_content`
- [ ] Cookie lišta → Souhlasím → po reloadu zmizí
- [ ] Sticky footer na krátkých stránkách

### Admin

- [ ] Mobilní hamburger menu (Sheet), zavře se po kliknutí
- [ ] `/admin/produkty` — search, mobilní karty, skeleton při načítání
- [ ] `/admin/objednavky` — filtry stavu
- [ ] Smazání produktu/kategorie/fotky → confirm dialog
- [ ] Role `editor` — nevidí Objednávky v menu

---

## Známé limity (mimo fázi 6)

- Homepage hero zatím z `siteConfig`, ne plně z `homepage_content`
- Filtry katalogu produktů — volitelné vylepšení
- Lighthouse skóre — spustit ručně po deployi (viz fáze 5)
