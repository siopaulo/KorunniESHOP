# Fáze 1: Architektura a základy

## Cíl fáze

Připravit stabilní technický základ moderního e-shopu pro bylinné domácí produkty z Korunní — architekturu, strukturu projektu, design systém, konfiguraci nástrojů a základní routing. Výstupem je spustitelný Next.js projekt připravený pro další fáze.

## Rozsah práce

- Návrh celkové architektury (monolit Next.js + Supabase + externí služby)
- Inicializace projektu (Next.js 15 App Router, TypeScript strict, Tailwind CSS)
- shadcn/ui + Framer Motion
- Struktura složek a naming conventions
- Design systém (barvy, typografie, spacing, komponenty)
- Základní layout (header, footer, admin shell placeholder)
- Routing pro veřejné stránky a admin (placeholder)
- ESLint, Prettier, TypeScript konfigurace
- Environment variables (.env.example)
- Dokumentace (README, ARCHITECTURE.md)
- Plán nasazení na Vercel/Netlify

## Technická rozhodnutí

### Stack

| Vrstva | Technologie | Důvod |
|--------|-------------|-------|
| Frontend | Next.js 15 App Router | SSR/SSG, SEO, Vercel-native |
| UI | React 19, Tailwind CSS, shadcn/ui | Rychlý vývoj, přístupnost, customizace |
| Animace | Framer Motion | Jemné, výkonové animace |
| Backend/DB | Supabase (PostgreSQL) | Auth, RLS, realtime, storage |
| Obrázky | Cloudinary | Transformace, CDN, optimalizace |
| Platby | Stripe (+ GoPay interface) | Standard, webhooky, PCI compliance |
| E-maily | Resend | Spolehlivé transakční e-maily |
| Monitoring | Sentry | Error tracking |
| Validace | Zod | Server + client validace |
| Formuláře | React Hook Form | Výkon, integrace se Zod |
| Testy | Vitest + Playwright | Unit + E2E |

### Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel / Netlify                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js App (Edge + Node)                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │  Public     │  │  Admin      │  │  API Routes  │  │  │
│  │  │  Pages      │  │  (protected)│  │  Webhooks    │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  │  Server Actions │ Middleware │ RSC                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    Supabase       Cloudinary      Stripe         Resend
    (DB/Auth)      (Images)        (Payments)     (Email)
```

### Struktura projektu

```
src/
├── app/                    # App Router
│   ├── (public)/           # Veřejné stránky
│   ├── (admin)/admin/      # Admin (chráněno middleware)
│   ├── api/                # API routes (webhooks)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui
│   ├── layout/             # Header, Footer, Nav
│   ├── shop/               # Produktové komponenty
│   ├── admin/              # Admin komponenty
│   └── shared/             # Sdílené (SEO, CookieBanner)
├── lib/
│   ├── supabase/           # Klienti (server/browser)
│   ├── stripe/             # Stripe helpers
│   ├── email/              # Resend
│   ├── invoice/            # InvoiceProvider interface
│   ├── payment/            # PaymentProvider interface
│   ├── validations/        # Zod schemas
│   └── utils.ts
├── hooks/
├── types/
├── config/                 # Site config, constants
└── styles/                 # Design tokens
docs/                       # Dokumentace fází
supabase/                   # Migrace, seed (fáze 2)
tests/                      # E2E (fáze 5)
```

### Naming conventions

- **Soubory komponent**: PascalCase (`ProductCard.tsx`)
- **Utility/hooks**: camelCase (`useCart.ts`, `formatPrice.ts`)
- **Routes**: kebab-case URL (`/obchodni-podminky`)
- **DB tabulky**: snake_case (`product_categories`)
- **Env vars**: SCREAMING_SNAKE_CASE (`NEXT_PUBLIC_SITE_URL`)
- **Typy**: PascalCase s prefixem pro entity (`Product`, `OrderStatus`)

### Environment variables

Viz `.env.example` — rozdělení na:
- `NEXT_PUBLIC_*` — veřejné (site URL, Supabase anon key)
- Server-only — Stripe secret, Resend, Sentry DSN, Supabase service role

### Design systém

**Směr**: Přírodní prémiový — zemité tóny, bylinná estetika, hodně whitespace.

**Paleta** (CSS variables):
- `--sage` — hlavní zelená (šalvěj)
- `--moss` — tmavší akcent
- `--cream` — pozadí
- `--earth` — hnědé tóny
- `--gold` — prémiový akcent
- `--charcoal` — text

**Typografie**:
- Display/Headings: **Cormorant Garamond** (elegantní, řemeslný charakter)
- Body: **Source Sans 3** (čitelnost, přístupnost)

**Spacing**: Tailwind default scale, konzistentní section padding `py-16 md:py-24`

### Předpoklady

- Název značky: **Korunní Byliny** (pracovní název, editovatelné v adminu)
- Primární jazyk: **čeština**
- Měna: **CZK**
- Doména: placeholder `https://korunni-byliny.cz` (env)
- Produktové varianty: volitelné — základní model bez variant, interface připraven

## Checklist úkolů

- [x] Inicializovat Next.js projekt (App Router, TS, Tailwind, ESLint)
- [x] Nastavit strict TypeScript (`tsconfig.json`)
- [x] Nastavit Prettier + ESLint pravidla
- [x] Nainstalovat a nakonfigurovat shadcn/ui
- [x] Nainstalovat Framer Motion
- [x] Vytvořit design tokens v `globals.css`
- [x] Nakonfigurovat fonty (next/font)
- [x] Vytvořit root layout s metadata template
- [x] Vytvořit Header komponentu (placeholder navigace)
- [x] Vytvořit Footer komponentu
- [x] Vytvořit route groups: `(public)`, `(admin)`
- [x] Placeholder stránky pro všechny veřejné routes
- [x] Admin layout shell (bez auth — fáze 2)
- [x] `src/config/site.ts` — konfigurace obchodu
- [x] `src/lib/utils.ts` — cn() helper
- [x] `.env.example` se všemi proměnnými
- [x] `README.md` — quick start
- [x] `docs/ARCHITECTURE.md` — architektura
- [x] `.gitignore` — standard Next.js + env
- [ ] Ověřit `npm run build` a `npm run lint`

## Akceptační kritéria

1. Projekt se spustí lokálně (`npm run dev`) bez chyb
2. Build projde (`npm run build`)
3. Lint projde bez errorů
4. Veřejné placeholder stránky jsou dostupné na definovaných URL
5. Admin route `/admin` má oddělený layout
6. Design systém je aplikován (barvy, fonty viditelné na homepage)
7. Responzivní layout funguje na mobile/tablet/desktop
8. `.env.example` obsahuje všechny potřebné proměnné s komentáři
9. README obsahuje instrukce pro lokální vývoj

## Bezpečnostní poznámky

- Tajné klíče pouze v server env, nikdy `NEXT_PUBLIC_*` pro secrets
- `.env.local` v `.gitignore`
- Middleware placeholder pro admin (implementace fáze 2)
- Security headers připravit v `next.config.ts` (CSP, X-Frame-Options)

## SEO / Performance poznámky

- `next/font` pro optimalizaci fontů (no layout shift)
- Metadata API v root layout
- `metadataBase` z env pro canonical URLs
- Image component připraven pro Cloudinary/Next Image
- Minimal JS bundle — RSC kde možné

## Co bude hotové na konci fáze

- Spustitelný Next.js projekt s design systémem
- Základní routing veřejných a admin stránek
- Konfigurace nástrojů (TS, ESLint, Prettier)
- Dokumentace architektury a env
- Připravenost pro fázi 2 (Supabase, auth, DB)

## Rozhodnutí a log

| Datum | Rozhodnutí | Důvod |
|-------|-----------|-------|
| 2026-05-24 | Next.js 15 App Router | Nejlepší SEO, Vercel deploy |
| 2026-05-24 | shadcn/ui místo vlastních komponent | Rychlost, a11y, customizace |
| 2026-05-24 | Route groups `(public)` / `(admin)` | Oddělení layoutů |
| 2026-05-24 | Cormorant + Source Sans 3 | Prémiový + čitelný |
| 2026-05-24 | Monorepo ne — single Next.js app | Jednoduchost, stačí pro e-shop |
| 2026-05-24 | Název značky: Korunní Byliny | Pracovní název, editovatelné v adminu |
| 2026-05-24 | Tailwind CSS v4 | Součást Next.js 15 stacku |
| 2026-05-24 | Payment/Invoice provider interfaces | Připraveno pro Stripe/GoPay a Fakturoid |

## Progress log (fáze 1)

**Hotovo:**
- 5 plánovacích dokumentů (01–05)
- Next.js projekt se strict TypeScript
- Design systém (sage/moss/cream/earth/gold paleta)
- shadcn/ui komponenty: Button, Card, Badge, Sheet, Separator
- Header, Footer, MobileNav
- Homepage s hero, kategoriemi, benefity, příběhem, CTA
- Všechny veřejné placeholder routes + právní stránky (šablony)
- Admin shell se sidebar navigací
- Middleware placeholder, robots.ts, sitemap.ts
- docs/ARCHITECTURE.md, docs/DEPLOYMENT.md, README, .env.example

**Zbývá:**
- Ověřit build a lint lokálně (`npm install && npm run build`)
- Fáze 2: Supabase, databáze, auth

## Co zbývá po fázi 1

→ Fáze 2: Supabase, databáze, auth, RLS, middleware ochrana adminu
