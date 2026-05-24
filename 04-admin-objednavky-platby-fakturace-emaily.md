# Fáze 4: Admin, objednávky, platby, fakturace a e-maily

## Cíl fáze

Vytvořit plně funkční administrační část a dokončit obchodní tok — od košíku přes Stripe platbu až po e-mailové notifikace a přípravu fakturace. E-shop musí být spravovatelný bez zásahu programátora.

## Rozsah práce

- Admin dashboard s metrikami
- CRUD produktů (včetně fotek přes Cloudinary)
- CRUD kategorií
- Správa objednávek (seznam, detail, změna stavu)
- Správa novinek/blogu
- Správa referencí
- Správa obsahu webu (homepage, bannery, footer)
- Správa právních textů
- Nastavení obchodu
- Stripe Checkout integrace
- Stripe webhooky
- Payment provider interface (+ GoPay placeholder)
- Invoice provider interface (+ placeholder)
- Resend e-maily (zákazník + admin)
- Audit logging admin akcí

## Technická rozhodnutí

### Admin architektura

```
/admin
├── /                    Dashboard
├── /produkty            CRUD
├── /produkty/novy
├── /produkty/[id]
├── /kategorie           CRUD
├── /objednavky          Seznam
├── /objednavky/[id]     Detail
├── /novinky             CRUD blog
├── /reference           CRUD
├── /obsah               Homepage, bannery, footer
├── /nastaveni           Obchodní údaje, doprava, platby
├── /pravni-texty        Legal pages editor
└── /uzivatele           Admin users (role admin only)
```

**Admin UI**: Sidebar navigace, data tables (shadcn), formuláře (RHF + Zod), toast notifikace, confirm dialogs pro delete.

### Cloudinary integrace

- Upload widget nebo server-side signed upload
- Transformace: `c_fill,w_800,h_800` pro produkty
- Ukládání `public_id` pro delete/update
- Next.js Image loader pro Cloudinary CDN

### Objednávkový tok

```
1. Zákazník vyplní checkout formulář
2. Server Action: validace, kontrola skladu
3. Vytvoření order (status: awaiting_payment)
4. Vytvoření Stripe Checkout Session
5. Redirect na Stripe
6. Webhook: checkout.session.completed
   → order status: paid
   → snížení skladu
   → odeslání e-mailů
   → trigger fakturace (async)
7. Redirect na /objednavka/uspech
```

### Payment Provider Interface

```typescript
interface PaymentProvider {
  name: 'stripe' | 'gopay';
  createCheckoutSession(order: Order): Promise<{ url: string }>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}
```

**StripeProvider** — plná implementace  
**GoPayProvider** — placeholder throwing `NotImplementedError`

### Invoice Provider Interface

```typescript
interface InvoiceProvider {
  name: 'manual' | 'fakturoid' | 'idoklad';
  createInvoice(order: Order): Promise<InvoiceResult>;
  getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus>;
  sendInvoice(invoiceId: string): Promise<void>;
}
```

**ManualInvoiceProvider** — vytvoří záznam v DB, status `draft`, admin vystaví ručně  
Budoucí: Fakturoid/iDoklad implementace

### E-mail šablony (Resend + React Email)

| Template | Příjemce | Trigger |
|----------|----------|---------|
| `order-confirmation` | Zákazník | Po zaplacení |
| `order-admin-notification` | Admin | Po zaplacení |
| `order-shipped` | Zákazník | Změna stavu → shipped |
| `contact-form` | Admin | Kontaktní formulář |

### Stripe webhook bezpečnost

- Verifikace signature (`stripe.webhooks.constructEvent`)
- Idempotence — kontrola duplicitních eventů
- Raw body parsing (disable JSON middleware)
- Logování do audit_logs

### Admin moduly — detail

#### Dashboard
- Tržby (dnes, týden, měsíc)
- Počet objednávek dle stavu
- Posledních 10 objednávek
- Produkty s nízkým skladem (< threshold)
- Graf tržeb (volitelně — jednoduchý)

#### Produkty CRUD
- Formulář: všechna pole + multi-image upload
- Drag & drop pořadí fotek
- Preview produktu
- Toggle aktivní/neaktivní
- Bulk akce (volitelně)

#### Objednávky
- Filtr dle stavu, data
- Detail: zákazník, položky, platba, faktura
- Změna stavu s potvrzením
- Admin poznámka
- Timeline stavů (audit log)

#### Obsah webu
- JSON editor nebo structured forms pro homepage sekce
- Banner management (obrázek, text, link, aktivní)
- Footer a kontaktní údaje
- Sociální sítě

### Předpoklady

- Stripe test mode pro vývoj
- Resend test domain pro dev e-maily
- Fakturace v MVP: manual provider, PDF generování až později
- Doprava: flat rate z settings (implementace v checkout)

## Checklist úkolů

### Admin UI
- [x] Admin layout (sidebar, header s user menu)
- [x] Dashboard s metrikami
- [x] Produkty — seznam, create, edit, delete
- [x] Produkt — image upload (Cloudinary)
- [x] Kategorie CRUD
- [x] Objednávky — seznam s filtry
- [x] Objednávky — detail + změna stavu
- [x] Novinky CRUD (markdown textarea)
- [x] Reference CRUD
- [ ] Obsah webu editor (homepage/bannery — odloženo)
- [x] Právní texty editor
- [x] Nastavení obchodu
- [x] Uživatelé a role (admin only)

### Checkout a platby
- [x] Server Action: createOrder
- [x] Stripe Checkout Session
- [x] API route: `/api/webhooks/stripe`
- [x] Webhook handler — update order, stock
- [x] PaymentProvider interface + Stripe impl
- [x] GoPay placeholder provider
- [x] Success/cancel redirect handling
- [x] Stock decrement (atomic)

### Fakturace
- [x] InvoiceProvider interface
- [x] ManualInvoiceProvider
- [x] Invoice DB records
- [x] Admin zobrazení fakturačního stavu

### E-maily
- [x] Resend setup
- [ ] React Email templates (HTML v kódu)
- [x] Order confirmation email
- [x] Admin notification email
- [x] Shipped notification email
- [x] Contact form email

### Bezpečnost a logování
- [x] Audit log pro admin CRUD
- [x] Audit log pro order status changes
- [x] Webhook idempotence
- [ ] Rate limit checkout action

## Akceptační kritéria

1. Admin může CRUD produkty včetně fotek bez kódu
2. Admin může měnit stavy objednávek
3. Kompletní nákupní tok funguje v Stripe test mode
4. Webhook spolehlivě aktualizuje stav objednávky
5. Zákazník dostane potvrzovací e-mail
6. Admin dostane notifikaci o nové objednávce
7. Sklad se sníží po zaplacení
8. Fakturační záznam se vytvoří (manual provider)
9. Role-based access funguje ve všech admin modulech
10. Všechny admin formuláře validované

## Bezpečnostní poznámky

- Stripe webhook secret v env, verifikace povinná
- Admin actions — server-side role check v každé action
- File upload — validace typu a velikosti
- Cloudinary signed uploads — preset s limitacemi
- Order creation — server-side price validation (ne z klienta!)
- CSRF protection via Server Actions
- Rate limiting na webhook endpoint (prevent flood)

## SEO / Performance poznámky

- Admin na separátním layout — neindexovat (`robots: noindex`)
- Admin bundle code-splitting
- Optimistic UI kde bezpečné (toggle active)

## Co bude hotové na konci fáze

- Plně spravovatelný e-shop
- Funkční platební tok
- E-mailové notifikace
- Fakturační příprava
- Připravenost pro fázi 5 (testy, optimalizace, deploy)
