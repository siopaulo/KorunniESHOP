# Fáze 5: Testování, optimalizace, legal, security audit a deploy příprava

## Cíl fáze

Dodat produkčně připravený projekt — testy, optimalizace výkonu, bezpečnostní audit, legal checklist a kompletní deploy dokumentaci. Po doplnění reálných klíčů, právních textů a domény je projekt ready for production.

## Rozsah práce

- Unit testy (Vitest)
- E2E testy (Playwright)
- Lighthouse audit a optimalizace
- Accessibility audit
- Security checklist
- GDPR/cookies flow verification
- Právní stránky review
- Environment variables audit
- Deployment dokumentace (Vercel/Netlify)
- README a admin dokumentace
- Seznam pro právníka/účetní

## Technická rozhodnutí

### Testovací strategie

| Typ | Nástroj | Co testovat |
|-----|---------|-------------|
| Unit | Vitest | Utils, validace, price calc, formatters |
| Integration | Vitest | Server actions (mocked Supabase) |
| E2E | Playwright | Nákupní tok, admin login, CRUD produkt |

### E2E scénáře

1. **Nákupní tok**: Homepage → produkt → košík → checkout → Stripe test → success
2. **Admin login**: Login → dashboard visible
3. **Produkt CRUD**: Create → edit → verify on frontend → delete
4. **Objednávka admin**: View order → change status → verify audit log
5. **Cookie consent**: Banner → accept → analytics loaded (mock)

### Lighthouse cíle

| Metrika | Cíl |
|---------|-----|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 100 |

### Deploy — Vercel (primární)

```
1. Push to GitHub
2. Import do Vercel
3. Env variables z .env.example
4. Doména: CNAME na Vercel
5. Supabase: allowed redirect URLs
6. Stripe: webhook URL production
7. Cloudinary: allowed domains
```

### Deploy — Netlify (alternativa)

```
1. next build + @netlify/plugin-nextjs
2. Env variables v Netlify dashboard
3. Doména: DNS setup
```

### Security checklist

- [ ] Všechny secrets v env, ne v kódu
- [ ] `.env.local` v `.gitignore`
- [ ] RLS policies aktivní a testované
- [ ] Admin routes chráněné middleware
- [ ] Stripe webhook signature verified
- [ ] Input validace server-side všude
- [ ] XSS prevence (sanitized HTML)
- [ ] CSRF — Server Actions default
- [ ] Rate limiting na auth, checkout, contact
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Dependencies audit (`npm audit`)
- [ ] No sensitive data in client bundles
- [ ] Error messages neprozrazují internals
- [ ] Audit logs funkční

### Legal checklist (implementace)

- [ ] Cookie consent banner s kategoriemi
- [ ] Obchodní podmínky — editovatelné, placeholder text
- [ ] Ochrana osobních údajů — editovatelné
- [ ] Cookies policy
- [ ] Reklamační řád
- [ ] Souhlas s OP při objednávce (povinný checkbox)
- [ ] GDPR consent při objednávce
- [ ] Informace o provozovateli v patičce
- [ ] IČO, DIČ v settings (placeholder)

**⚠️ DŮLEŽITÉ**: Všechny právní texty jsou šablony. Finální znění musí schválit právník a účetní.

### Seznam pro právníka/účetní

1. Obchodní podmínky e-shopu (B2C, ČR)
2. Zásady ochrany osobních údajů (GDPR)
3. Cookie policy
4. Reklamační řád (14 dní, postup)
5. Informace o právu na odstoupení
6. Fakturační údaje provozovatele
7. DPH sazby pro bylinné produkty/kosmetiku
8. Označení provozovatele (IČO, sídlo)
9. Smlouva se Stripe (platební brána)
10. Zpracovatelská smlouva se Supabase (DPA)

## Checklist úkolů

### Testy
- [ ] Vitest setup + config
- [ ] Unit: formatPrice, calculateDiscount, slugify
- [ ] Unit: Zod schemas (valid/invalid)
- [ ] Unit: cart calculations
- [ ] Playwright setup + config
- [ ] E2E: nákupní tok (Stripe test mode)
- [ ] E2E: admin login
- [ ] E2E: create product
- [ ] E2E: order status change
- [ ] CI script: `npm run test && npm run test:e2e`

### Optimalizace
- [ ] Lighthouse audit homepage, product, checkout
- [ ] Opravit identifikované problémy
- [ ] Bundle analysis (`@next/bundle-analyzer`)
- [ ] Image optimization review
- [ ] Font loading review
- [ ] Cache headers review
- [ ] Remove unused dependencies

### Accessibility
- [ ] axe-core scan (Playwright nebo manual)
- [ ] Keyboard navigation test
- [ ] Screen reader test (základní)
- [ ] Color contrast verification
- [ ] Focus management v modálech

### SEO
- [ ] Google Rich Results Test (Product, Organization)
- [ ] Sitemap validace
- [ ] robots.txt kontrola
- [ ] Meta tags na všech stránkách
- [ ] Canonical URLs

### Dokumentace
- [ ] README.md — kompletní
- [ ] `.env.example` — všechny proměnné s popisem
- [ ] `docs/DEPLOYMENT.md` — Vercel + Netlify
- [ ] `docs/ADMIN-GUIDE.md` — návod pro správce
- [ ] `docs/ARCHITECTURE.md` — aktualizace
- [ ] CHANGELOG.md (volitelně)

### Production readiness
- [ ] Error monitoring (Sentry) verified
- [ ] Logging strategy documented
- [ ] Backup strategy (Supabase auto-backup)
- [ ] Monitoring checklist
- [ ] Rollback plan

## Akceptační kritéria

1. Všechny unit testy procházejí
2. E2E testy procházejí v CI
3. Lighthouse Performance ≥ 90 na homepage
4. Lighthouse Accessibility ≥ 95
5. Lighthouse SEO ≥ 95
6. Security checklist 100% splněn
7. Cookie consent funguje správně
8. Právní stránky dostupné a editovatelné
9. Deploy dokumentace umožní nasazení bez dalších otázek
10. README umožní novému vývojáři rozjet projekt do 15 minut

## Bezpečnostní poznámky

- Production env oddělené od development
- Stripe live keys pouze v production env
- Supabase production project oddělený
- Pravidelný `npm audit` v CI
- Dependabot / Renovate doporučeno

## SEO / Performance poznámky

- Production: Vercel Edge CDN
- Static generation kde možné (legal, o nás)
- ISR pro produkty (revalidate 3600s)
- Monitoring Core Web Vitals (Vercel Analytics nebo Plausible)

## Co bude hotové na konci fáze

- Produkčně připravený projekt
- Testovací coverage klíčových toků
- Optimalizovaný výkon a SEO
- Kompletní dokumentace
- Checklist pro go-live

## Go-live checklist

- [ ] Production Supabase project
- [ ] Production Stripe account
- [ ] Resend verified domain
- [ ] Cloudinary production cloud
- [ ] Sentry production project
- [ ] Vlastní doména + SSL
- [ ] Právní texty schváleny právníkem
- [ ] Fakturační údaje ověřeny účetním
- [ ] Testovací objednávka v production
- [ ] Monitoring aktivní
- [ ] Backup ověřen
