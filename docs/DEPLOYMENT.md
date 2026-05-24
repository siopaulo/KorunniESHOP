# Deployment — Korunní Byliny

Produkční nasazení e-shopu na **Vercel** (doporučeno) nebo **Netlify**.

---

## Předpoklady

- GitHub repozitář s projektem
- Production Supabase projekt (migrace + seed)
- Stripe účet (live keys až po schválení právních textů)
- Resend — ověřená doména odesílatele
- Cloudinary production cloud
- Vlastní doména + DNS

---

## Environment variables

Zkopírujte `.env.example` → Vercel/Netlify dashboard. Minimální production sada:

| Proměnná | Kde | Popis |
|----------|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | Public | `https://vase-domena.cz` |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL Supabase projektu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anon klíč |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Service role (webhooky, admin akce) |
| `STRIPE_SECRET_KEY` | Secret | Live secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Live publishable key |
| `STRIPE_WEBHOOK_SECRET` | Secret | Signing secret z Stripe dashboardu |
| `RESEND_API_KEY` | Secret | Resend API |
| `RESEND_FROM_EMAIL` | Secret | Ověřený odesílatel |
| `ADMIN_NOTIFICATION_EMAIL` | Secret | Notifikace objednávek |
| `CLOUDINARY_*` | Mixed | Cloud name (public), API key/secret |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | Sentry (volitelné) |

**Nikdy** necommitujte `.env.local`.

---

## Vercel (primární)

### 1. Import projektu

1. [vercel.com](https://vercel.com) → **Add New Project**
2. Import z GitHubu (`main` větev)
3. Framework: **Next.js** (auto-detect)
4. Vložit env variables

### 2. Build

Vercel spustí `npm run build` automaticky. Lokální ověření:

```bash
npm run test:ci
```

### 3. Custom doména

1. Vercel → Project → **Domains** → přidat doménu
2. DNS u registrátora: **CNAME** `@` nebo `www` → `cname.vercel-dns.com`
3. Aktualizovat `NEXT_PUBLIC_SITE_URL` na production URL

### 4. Supabase Auth

V Supabase → **Authentication → URL Configuration**:

- Site URL: `https://vase-domena.cz`
- Redirect URLs: `https://vase-domena.cz/auth/callback`, `http://localhost:3001/auth/callback`

### 5. Stripe webhook

1. Stripe Dashboard → **Developers → Webhooks**
2. Endpoint: `https://vase-domena.cz/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `payment_intent.payment_failed` (dle `docs/STRIPE.md`)
4. Zkopírovat **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 6. Cloudinary

V Cloudinary settings povolit delivery doménu production webu.

### 7. Ověření po deployi

- [ ] Homepage, produkty, checkout načítají data
- [ ] Testovací objednávka (Stripe test/live dle fáze)
- [ ] Admin login + CRUD produkt
- [ ] E-mail po objednávce
- [ ] Sentry zachytává chyby (pokud zapnuto)

---

## Netlify (alternativa)

Soubor `netlify.toml` je připraven. Postup:

1. Netlify → **Add new site** → GitHub
2. Build command: `npm run build`
3. Plugin: `@netlify/plugin-nextjs` (doinstalovat v Netlify UI nebo `npm i -D @netlify/plugin-nextjs`)
4. Env variables stejné jako u Vercel
5. DNS dle Netlify dokumentace

---

## CI/CD

GitHub Actions workflow `.github/workflows/ci.yml`:

- `typecheck`, `lint`, unit testy, `build`
- E2E smoke testy (Playwright)

---

## Rollback

- **Vercel:** Deployments → předchozí deployment → **Promote to Production**
- **DB:** Supabase point-in-time recovery (placený plán) nebo ruční SQL záloha

---

## Go-live checklist

- [ ] Production env variables
- [ ] Právní texty schváleny právníkem (viz `docs/LEGAL-CHECKLIST.md`)
- [ ] IČO/DIČ v admin → Nastavení
- [ ] Testovací objednávka end-to-end
- [ ] SSL aktivní (Vercel/Netlify automaticky)
- [ ] Monitoring (Sentry)
- [ ] Stripe webhook 200 OK v logu

---

## Lokální produkční simulace

```bash
npm run build
npm run start
# nebo PORT=3001 npm run start
```
