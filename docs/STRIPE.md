# Stripe — nastavení plateb

## 1. Stripe účet

1. Vytvořte účet na [stripe.com](https://stripe.com)
2. Zapněte **Test mode** pro vývoj

## 2. Environment variables

Do `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. Webhook (lokální vývoj)

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

Zkopírujte `whsec_...` do `STRIPE_WEBHOOK_SECRET`.

## 4. Webhook (produkce)

V Stripe Dashboard → Developers → Webhooks:

- URL: `https://vase-domena.cz/api/webhooks/stripe`
- Event: `checkout.session.completed`

## 5. Testovací platba

1. Přidejte produkt do košíku na `/produkty`
2. Dokončete `/pokladna`
3. Stripe test karta: `4242 4242 4242 4242`, libovolné datum/CVC

## 6. Resend (e-maily)

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=objednavky@vase-domena.cz
ADMIN_NOTIFICATION_EMAIL=admin@vase-domena.cz
```

Bez Resend se objednávka uloží, e-maily se pouze přeskočí (log do konzole).
