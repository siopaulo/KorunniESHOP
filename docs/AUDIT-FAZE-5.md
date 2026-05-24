# Audit fáze 5 — testy, optimalizace, legal, deploy

> Datum: 2026-05-24

---

## Shrnutí

Fáze 5 dokončena v rozsahu přípravy na produkci: unit testy (Vitest), E2E smoke (Playwright), bezpečnostní a legal opravy, dynamická sitemap, kompletní deploy dokumentace a CI workflow.

---

## Testy ✅

| Nástroj | Soubory | Pokrytí |
|---------|---------|---------|
| **Vitest** | `tests/unit/*.test.ts` | `formatPrice`, `slugify`, `calculateDiscount`, cart výpočty, `calculateShipping`, Zod schémata, cookie consent |
| **Playwright** | `e2e/smoke.spec.ts` | Homepage, produkty, legal, reference, cookie banner, admin login |
| **CI** | `.github/workflows/ci.yml` | typecheck + lint + unit + build + e2e |

### Příkazy

```bash
npm run test          # unit
npm run test:e2e      # Playwright (spustí dev server na :3001)
npm run test:ci       # typecheck + lint + unit + build
```

---

## Code review — opravené nedostatky

| Problém | Oprava |
|---------|--------|
| Právní stránky statické, admin DB nepoužitá | `LegalPageView` + `getLegalPageBySlug` |
| Footer ignoroval `site_settings` | Async `Footer` z DB, IČO/DIČ |
| Cookie banner bez kategorií | Nezbytné / analytické / nastavení |
| Kontakt bez rate limitu | 5 req/min na IP |
| Sitemap jen statické URL | + produkty, kategorie, blog |
| Chyběl `calculateDiscount` | `src/lib/pricing.ts` + testy |
| Cart logika netestovatelná | `src/lib/cart/calculations.ts` |
| CSP / HSTS chyběly | Production headers v `next.config.ts` |
| Deploy docs neúplné | `docs/DEPLOYMENT.md` |
| Chyběl admin návod | `docs/ADMIN-GUIDE.md` |

---

## Security checklist

| Položka | Stav |
|---------|------|
| Secrets v env | ✅ |
| `.env.local` v gitignore | ✅ |
| RLS v migraci | ✅ (ověřit v Supabase) |
| Admin middleware + role | ✅ |
| Stripe webhook signature | ✅ |
| Zod validace server-side | ✅ |
| CSRF (Server Actions) | ✅ |
| Rate limit login/checkout/contact/webhook | ✅ |
| Security headers | ✅ (+ CSP/HSTS v production) |
| Audit log | ✅ |
| Rate limit multi-instance | ⚠️ in-memory — pro scale Upstash/Redis |

---

## Legal checklist

| Položka | Stav |
|---------|------|
| Cookie banner s kategoriemi | ✅ |
| OP/GDPR checkbox checkout | ✅ (fáze 4) |
| Právní stránky editovatelné | ✅ admin + veřejný web |
| IČO/DIČ v nastavení + footer | ✅ |
| Finální texty schváleny | ⛔ na právníkovi — viz `docs/LEGAL-CHECKLIST.md` |

---

## SEO / Performance

| Položka | Stav |
|---------|------|
| Dynamická sitemap | ✅ |
| robots.txt | ✅ |
| JSON-LD produkt | ✅ (fáze 3/4) |
| Lighthouse audit | ⚠️ spustit ručně na production build — cíle v `05-*.md` |
| ISR produkty | ⚠️ volitelné vylepšení |

**Doporučení:** Po deployi spustit Lighthouse na `/`, `/produkty/[slug]`, `/pokladna`.

---

## Dokumentace ✅

- `docs/DEPLOYMENT.md` — Vercel + Netlify + go-live
- `docs/ADMIN-GUIDE.md` — návod správce
- `docs/LEGAL-CHECKLIST.md` — pro právníka/účetní
- `README.md` — aktualizováno
- `vercel.json`, `netlify.toml`

---

## Build / test výsledky

| Příkaz | Výsledek |
|--------|----------|
| `npm run typecheck` | ✅ exit 0 |
| `npm run lint` | ✅ bez chyb |
| `npm run test` | ✅ 22/22 testů |
| `npm run build` | ✅ Next.js 15.5.18 |
| `npm run test:e2e` | ✅ 6/6 Playwright smoke |

---

## Známé limity (post-fáze 5)

- E2E neobsahuje plný Stripe checkout (vyžaduje test keys + DB)
- Lighthouse skóre neautomatizováno v CI
- `@netlify/plugin-nextjs` není v dependencies — doinstalovat při Netlify deployi
- Analytické skripty (GA/Plausible) nejsou zapojeny — cookie consent je připraven

---

## Go-live

Viz `docs/DEPLOYMENT.md` a `05-testovani-optimalizace-legal-deploy-priprava.md` § Go-live checklist.
