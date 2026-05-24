# Korunní Byliny — E-shop

Moderní e-shop pro prodej domácích bylinných produktů z Korunní.

## Stack

- **Next.js 15** (App Router, TypeScript strict)
- **Tailwind CSS 4** + **shadcn/ui**
- **Framer Motion** — animace
- **Supabase** — databáze, auth, storage (fáze 2)
- **Stripe** — platby (fáze 4)
- **Cloudinary** — produktové fotografie (fáze 4)
- **Resend** — e-maily (fáze 4)
- **Sentry** — monitoring (fáze 2)

## Rychlý start

```bash
# Instalace závislostí
npm install

# Zkopírovat env proměnné
cp .env.example .env.local

# Spustit dev server
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000).

## Skripty

| Příkaz | Popis |
|--------|-------|
| `npm run dev` | Vývojový server (Turbopack) |
| `npm run build` | Produkční build |
| `npm run start` | Spuštění produkčního serveru |
| `npm run lint` | ESLint kontrola |
| `npm run typecheck` | TypeScript kontrola |
| `npm run format` | Prettier formátování |

## Struktura projektu

```
src/
├── app/
│   ├── (public)/     # Veřejné stránky e-shopu
│   ├── (admin)/      # Administrační část
│   └── api/          # API routes (webhooks — fáze 4)
├── components/       # UI komponenty
├── config/           # Konfigurace webu
├── lib/              # Utility, integrace
└── types/            # TypeScript typy
```

## Plán implementace

Projekt je rozdělen do 5 fází — viz kořenové soubory `01-*.md` až `05-*.md`.

| Fáze | Stav | Popis |
|------|------|-------|
| 1 | ✅ | Architektura, design systém, routing |
| 2 | ✅ | Supabase, DB, auth, security |
| 3 | ⏳ | Veřejný frontend, UX/UI, SEO |
| 4 | ⏳ | Admin, platby, e-maily, fakturace |
| 5 | ⏳ | Testy, optimalizace, deploy |

## Dokumentace

- [Architektura](docs/ARCHITECTURE.md)
- [Supabase setup](docs/SUPABASE.md)
- [Deployment](docs/DEPLOYMENT.md) (fáze 5)

## Právní upozornění

Právní texty (OP, GDPR, cookies, reklamační řád) jsou **šablony**. Finální znění musí schválit právník a účetní před produkčním spuštěním.

## Licence

Soukromý projekt — všechna práva vyhrazena.
