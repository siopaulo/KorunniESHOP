# Inspirace `EsterkyGalerie` — refactor plán pro Korunní Byliny

> **Kontrolní krok (2026-05-24):** Referenční projekt ověřen v repozitáři. Složka `esterkyWeb` **neexistuje**. Použita **`EsterkyGalerie/`**.

---

## 0. Kontrolní krok — cesty a existence

| Položka | Výsledek |
|---------|----------|
| `esterkyWeb` | **Nenalezeno** (ani v `/home/pavli/MamkyWEB`, ani v `/home/pavli`) |
| `EsterkyGalerie` | **Nalezeno** |
| **Přesná cesta (WSL)** | `/home/pavli/MamkyWEB/EsterkyGalerie` |
| **Přesná cesta (UNC)** | `\\wsl.localhost\Ubuntu\home\pavli\MamkyWEB\EsterkyGalerie` |
| npm balíček | `esterky-fotky` v1.2.2 — fotografické portfolio (Next.js 16 + Supabase + Cloudinary) |
| Vyloučení z typecheck | `tsconfig.json` → `"exclude": ["node_modules", "EsterkyGalerie"]` |

---

## 1. Shrnutí referenčního projektu `EsterkyGalerie`

Samostatný Next.js projekt **uvnitř monorepa** MamkyWEB — galerie / portfolio fotografa Esterky, ne e-shop.

### Hlavní složky (1. úroveň)

```
EsterkyGalerie/
├── app/                    # App Router (veřejný + /studio admin)
├── components/
│   ├── admin/              # Studio UI (sidebar, tabulky, uploadery)
│   ├── public/             # Galerie, lightbox, hero carousel
│   ├── shared/             # cloudinary-image.tsx
│   └── ui/                 # shadcn (alert-dialog, sheet, …)
├── features/               # Doménová logika po modulech
│   ├── photos/             # actions.ts, queries.ts
│   ├── stories/            # Příběhy (blog-like)
│   ├── reviews/            # Recenze
│   ├── contact/            # Kontakt + odpovědi
│   ├── pages/              # CMS stránky
│   ├── site-settings/
│   ├── tags/
│   ├── pricing/
│   └── blocks/             # Block editor schémata
├── lib/                    # cloudinary, auth, supabase, env, seo
├── types/                  # database typy
├── supabase/
└── package.json
```

### Klíčové soubory (reálné)

| Soubor | Účel |
|--------|------|
| `app/studio/layout.tsx` | Admin shell |
| `components/admin/studio-chrome.tsx` | Sidebar + mobilní hamburger menu |
| `components/admin/sidebar.tsx` | Desktop navigace |
| `components/admin/confirm-dialog.tsx` | AlertDialog pro destruktivní akce |
| `components/admin/photo-uploader.tsx` | Cloudinary signed upload z browseru |
| `components/admin/admin-table-skeleton.tsx` | Loading skeleton tabulek |
| `components/shared/cloudinary-image.tsx` | `<img>` + srcset, bez next/image |
| `lib/cloudinary-url.ts` | `cldUrl`, `cldSrcSet` z `public_id` |
| `lib/cloudinary.ts` | `signUpload`, `deleteFromCloudinary` (server-only) |
| `app/api/upload/sign/route.ts` | POST podpis pro admin upload |
| `lib/admin-studio-nav.ts` | Konfigurace admin navigace |
| `features/*/actions.ts` | Server actions per modul |
| `features/*/queries.ts` | Supabase dotazy |

### Veřejné routes (reference — **nepřenášet**)

- `/galerie`, `/pribehy`, `/studio/*` — galerijní doména
- Admin prefix **`/studio`**, ne `/admin`

---

## 2. Patterny nalezené v referenci (soubor → adaptace)

| Pattern | Soubor v `EsterkyGalerie` | Stav v MamkyWEB | Poznámka |
|---------|---------------------------|-----------------|----------|
| Cloudinary delivery přes `<img>` + srcset | `components/shared/cloudinary-image.tsx`, `lib/cloudinary-url.ts` | ✅ `src/components/shared/CloudinaryImage.tsx`, `src/lib/cloudinary/url.ts` | **Princip**, ne kopie — u nás URL místo `public_id` |
| Upload bez transformace při uploadu | `lib/cloudinary.ts` (`signUpload`) | ✅ `src/lib/cloudinary/upload.ts` (server stream) | Reference: signed upload z browseru; my: server-side stream |
| Admin sidebar + mobilní menu | `studio-chrome.tsx`, `sidebar.tsx` | ⚠️ `AdminShell.tsx` + `AdminMobileNav.tsx` (Sheet) | Reference: inline hamburger; my: Radix Sheet |
| Confirm delete dialog | `confirm-dialog.tsx` | ❌ Chybí | Krok C |
| Admin table skeleton | `admin-table-skeleton.tsx` | ❌ Chybí | Krok C |
| Features složka (actions/queries) | `features/photos/actions.ts` | ⚠️ `src/lib/actions/*`, `src/lib/data/*` | Jiná struktura, stejná idea |
| Server-only guard | `import "server-only"` v lib | ✅ | |
| Sonner toasty | `photo-uploader.tsx` | ✅ | |
| Role admin (`requireAdmin`) | `lib/auth.ts` | ✅ `requireRole` / `requireAuth` | |
| Sticky min-h-screen layout | `studio-chrome.tsx` | ✅ `(public)/layout.tsx` | |
| Lightbox / galerie grid | `lightbox.tsx`, `photo-grid.tsx` | ❌ **Záměrně ne** | E-shop používá ProductGallery |
| Block editor | `block-editor.tsx` | ❌ **Záměrně ne** | |
| Hero carousel | `home-hero-carousel.tsx` | ❌ | Vlastní `HomeSections` |

---

## 3. Co z reference **nepoužíváme** (kontrola 1:1)

| Oblast | Ověření |
|--------|---------|
| Branding Esterky | ✅ V `src/` žádné výskyty „Esterky“, „Studio“, galerie logiky |
| Galerijní moduly (photos, lightbox, tagy galerie) | ✅ Nepřeneseno |
| URL `/studio`, `/galerie`, `/pribehy` | ✅ MamkyWEB používá `/admin`, `/produkty`, `/kosik` |
| Texty a copy z reference | ✅ Vlastní „Korunní Byliny“ v `src/config/site.ts` |
| Vizuál (font-serif Studio) | ✅ Cormorant + sage/moss paleta zachována |
| Signed browser upload (`/api/upload/sign`) | ⚠️ Jiný přístup — server upload v `product-images.ts` (validní varianta) |

---

## 4. Rozdíly Cloudinary (reference vs. náš projekt)

| | EsterkyGalerie | Korunní Byliny |
|---|----------------|----------------|
| Upload | Signed POST z browseru → `app/api/upload/sign/route.ts` | Server Action + `upload_stream` |
| ID v DB | `public_id` | `url` + `public_id` v `product_images` |
| Delivery | `cldUrl(publicId, variant)` | `cloudinaryImageUrl(fullUrl, variant)` |
| next/image | Nepoužívá pro Cloudinary | Nepoužívá pro Cloudinary ✅ |
| Chyba Invalid Signature | N/A (signed upload) | Opraveno — bez `transformation` v upload_stream |

---

## 5. Build / lint / typecheck (kontrolní běh)

| Příkaz | Výsledek | Poznámka |
|--------|----------|----------|
| `npm run typecheck` | ✅ exit 0 | Bez chyb |
| `npm run lint` | ✅ exit 0 | „No ESLint warnings or errors“ |
| `npm run build` | ❌ → ✅ po opravě | Viz níže |

### Build chyba (nalezeno)

```
./src/lib/data/products.ts — import "server-only"
Import trace: products.ts → ProductPurchasePanel.tsx (client)
```

**Příčina:** Client komponenta importovala modul s `server-only` (přímě i přes `getPrimaryImageUrl`).

**Oprava (provedena):** Typy a helpery přesunuty do `src/lib/data/product-types.ts` (bez `server-only`). Client komponenty importují odtud.

**Krok B/C/D:** ⛔ **Pozastaveno** do potvrzení čistého buildu uživatelem.

---

## 6. Refactor plán (beze změny kroků)

### Krok A — hotovo (s výjimkou ověření buildu uživatelem)
- Cloudinary, ProductCard, detail produktu, sticky footer, admin mobile nav

### Krok B — obsah (⛔ nezačínat)
- Blog, reference, o nás z DB, cookie banner

### Krok C — admin UX (⛔ nezačínat)
- Inspirovat `confirm-dialog.tsx`, `admin-table-skeleton.tsx`, tabulky

### Krok D — fáze 5 (⛔ nezačínat)
- Lighthouse, testy, deploy

---

## 7. Akceptační kritéria (aktualizace)

- [x] Referenční složka ověřena — `EsterkyGalerie`, ne `esterkyWeb`
- [x] Konkrétní soubory a patterny z reference zdokumentovány
- [x] Žádná 1:1 kopie galerijní logiky / brandingu
- [x] `typecheck` + `lint` čisté
- [ ] `build` — opraveno v kódu, **uživatel má znovu spustit** `npm run build`
- [ ] Kroky B/C/D — až po čistém buildu

---

## 8. Cloudinary — Invalid Signature (shrnutí)

1. Upload **bez** transformací v `upload_stream`
2. Transformace jen v delivery URL (`f_auto,q_auto,dpr_auto,w_*`)
3. Zobrazení přes `CloudinaryImage` (`<img>`), ne `next/image`
4. `.trim()` na API klíčích v `.env.local`
