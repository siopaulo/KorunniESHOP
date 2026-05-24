# Korunní Byliny — E-shop

Moderní e-shop pro prodej domácích bylinných produktů z Korunní.

## Stack

- **Next.js 15** (App Router, TypeScript strict)
- **Tailwind CSS 4** + **shadcn/ui**
- **Supabase** — PostgreSQL, Auth, RLS
- **Stripe** — platby
- **Cloudinary** — produktové fotografie
- **Resend** — transakční e-maily
- **Sentry** — error monitoring

## Rychlý start (~15 min)

```bash
npm install
cp .env.example .env.local
# Doplňte Supabase klíče — viz docs/SUPABASE.md
npm run dev
```

Dev server: [http://localhost:3000](http://localhost:3000) (nebo `--port 3001` pokud je 3000 obsazený).

Supabase: spusťte migraci + `supabase/seed.sql`, vytvořte admin uživatele v Auth dashboardu.

## Skripty

| Příkaz | Popis |
|--------|-------|
| `npm run dev` | Vývojový server (Turbopack) |
| `npm run build` | Produkční build |
| `npm run start` | Produkční server lokálně |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Unit testy (Vitest) |
| `npm run test:e2e` | E2E smoke (Playwright) |
| `npm run test:ci` | typecheck + lint + test + build |
| `npm run audit:deps` | npm audit |

## Struktura

```
src/app/(public)/   # E-shop
src/app/(admin)/    # Administrace
src/lib/            # Data, actions, validace
tests/unit/         # Vitest
e2e/                # Playwright
docs/               # Dokumentace
```

## Fáze projektu

| Fáze | Stav |
|------|------|
| 1–4 | ✅ Architektura, DB, commerce, admin |
| 6 | ✅ Refactor admin UX (EsterkyGalerie inspirace) |
| 5 | ✅ Testy, legal, deploy příprava |

## Dokumentace

- [Architektura](docs/ARCHITECTURE.md)
- [Supabase](docs/SUPABASE.md)
- [Stripe](docs/STRIPE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Admin průvodce](docs/ADMIN-GUIDE.md)
- [Legal checklist](docs/LEGAL-CHECKLIST.md)
- [Audit fáze 5](docs/AUDIT-FAZE-5.md)
- [Audit fáze 6](docs/AUDIT-FAZE-6.md)

## Právní upozornění

Právní texty jsou **šablony** editovatelné v adminu. Finální znění musí schválit právník před go-live.

## Licence

Soukromý projekt.
