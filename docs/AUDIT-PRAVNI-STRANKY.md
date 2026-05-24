# Audit právních stránek — Korunní Byliny (Fáze 7)

Datum auditu: květen 2026

## Veřejné stránky

| URL | Soubor | DB slug | Zdroj obsahu |
|-----|--------|---------|--------------|
| `/obchodni-podminky` | `src/app/(public)/obchodni-podminky/page.tsx` | `terms` | DB → fallback `src/lib/legal/default-content.ts` |
| `/ochrana-osobnich-udaju` | `src/app/(public)/ochrana-osobnich-udaju/page.tsx` | `privacy` | DB → fallback |
| `/cookies` | `src/app/(public)/cookies/page.tsx` | `cookies` | DB → fallback |
| `/reklamacni-rad` | `src/app/(public)/reklamacni-rad/page.tsx` | `returns` | DB → fallback |
| `/odstoupeni-od-smlouvy` | `src/app/(public)/odstoupeni-od-smlouvy/page.tsx` | `withdrawal` | DB → fallback (nový slug) |
| `/odstoupeni-od-smlouvy/formular` | `src/app/(public)/odstoupeni-od-smlouvy/formular/page.tsx` | — | hardcoded vzor v `default-content.ts` |
| `/kontakt` | `src/app/(public)/kontakt/page.tsx` | — | `siteConfig` + `site_settings` (identifikace provozovatele) |

## Admin

| URL | Soubor | Editovatelné |
|-----|--------|--------------|
| `/admin/pravni-texty` | `src/app/(admin)/admin/(dashboard)/pravni-texty/page.tsx` | title + content všech `legal_pages` |

## Hardcoded vs. dynamické

### Dynamické z DB (`legal_pages`)

- `terms`, `privacy`, `cookies`, `returns`, `withdrawal` (po migraci fáze 7)
- Načítání: `getLegalPageBySlug()` v `src/lib/data/content.ts`
- Zobrazení: `LegalPageView` — pokud DB obsahuje starou šablonu (⚠️ / krátký text), použije se fallback z `default-content.ts`

### Hardcoded (záměrně)

- Vzorový formulář odstoupení: `WITHDRAWAL_FORM_CONTENT`
- Disclaimer u referencí: `TESTIMONIALS_DISCLAIMER`
- Placeholder údaje provozovatele: `src/lib/legal/operator.ts` (`[DOPLNIT …]`)
- Cookie banner text: `CookieBanner.tsx`
- Checkout souhlasy: `CheckoutForm.tsx`

### Odstraněné duplicity

- Varování „⚠️ Tento text je šablona…“ z `LegalPageView`
- Varování z patičky webu
- Varování z admin `/admin/pravni-texty`

## Co chybělo před fází 7 (doplněno)

- Samostatná stránka odstoupení od smlouvy
- Vzorový formulář odstoupení
- Plné české texty OP, GDPR, cookies, reklamace
- Odkaz na odstoupení ve footeru
- Odkaz „Nastavení cookies“ v patičce
- Text o referencích / autenticitě na `/reference`

## Checkout — povinné prvky

| Požadavek | Stav |
|-----------|------|
| Souhlas s OP (checkbox + odkaz) | ✅ `CheckoutForm` |
| Souhlas s GDPR (checkbox + odkaz) | ✅ |
| Tlačítko „Objednat a zaplatit“ | ✅ (upraveno ve fázi 7) |
| Zobrazení položek, mezisoučtu, dopravy, platby | ✅ |
| Struktura nejnižší ceny 30 dní u slev | ✅ v OP + produktových kartách |

## Footer — povinné odkazy

- Obchodní podmínky, GDPR, Cookies, Reklamační řád, Odstoupení ✅
- Nastavení cookies ✅

## Placeholder údaje provozovatele

Doplňte v **Nastavení** (`/admin/nastaveni`) nebo přímo v `src/lib/legal/operator.ts` před ostrým spuštěním:

- `[DOPLNIT PROVOZOVATELE]`, IČO, adresa, e-mail, telefon, účet, plátce DPH

## E-mailové šablony

- Objednávky: `src/lib/email/send.ts` (Resend, bez klíče neodesílá)
- Admin mail modul: `src/lib/email/admin-mail.ts` + `/admin/zpravy` (fáze 7)

## Migrace (nespouštět na PROD bez potvrzení)

Soubor: `supabase/migrations/20260525000000_phase7_contact_messages.sql`

- Tabulky `contact_messages`, `contact_message_replies`, `mail_log`
- Sloupec `testimonials.is_verified`
- Nový řádek `legal_pages` slug `withdrawal`
