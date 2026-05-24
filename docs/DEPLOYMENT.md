# Deployment — Korunní Byliny

> Kompletní deploy dokumentace bude doplněna ve fázi 5.

## Vercel (primární)

### Požadavky

- GitHub/GitLab repozitář
- Vercel účet
- Production Supabase projekt
- Stripe production keys
- Resend verified domain
- Cloudinary production cloud

### Kroky

1. Import projektu do Vercel
2. Nastavit environment variables (viz `.env.example`)
3. Deploy z `main` větve
4. Připojit custom doménu
5. Aktualizovat Supabase Auth redirect URLs
6. Nastavit Stripe webhook endpoint: `https://vase-domena.cz/api/webhooks/stripe`
7. Ověřit Sentry DSN pro production

### Build

```bash
npm run build
```

Vercel automaticky detekuje Next.js a spustí build.

## Netlify (alternativa)

1. Instalace `@netlify/plugin-nextjs`
2. `netlify.toml` konfigurace (fáze 5)
3. Env variables v Netlify dashboard

## Checklist před go-live

- [ ] Production env variables nastaveny
- [ ] Právní texty schváleny právníkem
- [ ] Fakturační údaje ověřeny účetním
- [ ] Testovací objednávka v production
- [ ] SSL certifikát aktivní
- [ ] Monitoring (Sentry) aktivní
