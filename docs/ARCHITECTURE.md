# Architektura — Korunní Byliny E-shop

## Přehled

Monolitická Next.js aplikace s Supabase backendem a externími službami pro platby, e-maily a obrázky. Navrženo pro nasazení na **Vercel** (primární) nebo **Netlify**.

## Vrstvy aplikace

### 1. Prezentace (Frontend)

- **Veřejná část** (`src/app/(public)/`) — SSR/SSG stránky pro zákazníky
- **Admin část** (`src/app/(admin)/admin/`) — chráněná SPA-like administrace
- **Komponenty** — sdílené UI (shadcn/ui), layout, shop-specific

### 2. Aplikační logika

- **Server Actions** — mutace (CRUD, objednávky)
- **API Routes** — webhooky (Stripe), externí callbacky
- **Middleware** — auth, security headers, rate limiting

### 3. Data

- **Supabase PostgreSQL** — primární databáze
- **Row Level Security** — ochrana dat na úrovni DB
- **Supabase Auth** — autentizace adminů

### 4. Externí služby

| Služba | Účel |
|--------|------|
| Cloudinary | Produktové fotografie, CDN |
| Stripe | Platby kartou |
| Resend | Transakční e-maily |
| Sentry | Error monitoring |

## Modulární rozhraní

### PaymentProvider

Abstrakce platební brány — umožňuje výměnu Stripe ↔ GoPay.

```
src/lib/payment/
├── types.ts
├── stripe-provider.ts
└── gopay-provider.ts (placeholder)
```

### InvoiceProvider

Abstrakce fakturačního systému — manual, Fakturoid, iDoklad.

```
src/lib/invoice/
├── types.ts
├── manual-provider.ts
└── fakturoid-provider.ts (placeholder)
```

## Bezpečnost

- Tajné klíče pouze server-side
- RLS jako primární obrana dat
- Middleware ochrana `/admin/*`
- Webhook signature verification
- Input validace (Zod) na klientu i serveru
- Security headers v `next.config.ts`
- Audit log pro admin akce

## Deployment

### Vercel (doporučeno)

1. GitHub repo → Vercel import
2. Env variables z `.env.example`
3. Custom domain → DNS CNAME
4. Supabase redirect URLs update
5. Stripe webhook URL → production

### Netlify

1. `@netlify/plugin-nextjs`
2. Env variables v dashboard
3. DNS setup

## Datový tok objednávky

```
Checkout Form → createOrder (Server Action)
  → Stripe Checkout Session
  → Webhook (checkout.session.completed)
    → Update order status
    → Decrement stock
    → Send emails (Resend)
    → Create invoice record
```

## Konvence

- **Routes**: kebab-case URL (`/obchodni-podminky`)
- **Komponenty**: PascalCase soubory
- **DB**: snake_case tabulky a sloupce
- **Env**: SCREAMING_SNAKE_CASE

## Rozhodnutí

| Rozhodnutí | Důvod |
|-----------|-------|
| Next.js monolit | Jednoduchost, SEO, Vercel-native |
| Supabase | Auth + DB + RLS v jednom |
| Cloudinary místo Supabase Storage | Lepší image transforms pro e-shop |
| Ceny v CZK decimal | Jednoduchost pro český trh |
| Server Actions pro mutace | Type-safe, CSRF protected |
