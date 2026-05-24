# Admin průvodce — Korunní Byliny

Návod pro správce e-shopu (role `admin`, `editor`, `orders_only`).

---

## Přihlášení

1. Otevřete `/admin/login`
2. E-mail a heslo z Supabase Auth
3. Role se nastavuje v tabulce `admin_profiles` (admin může měnit v **Uživatelé**)

### Role

| Role | Přístup |
|------|---------|
| **admin** | Vše |
| **editor** | Produkty, kategorie, novinky, reference — **ne** objednávky, nastavení, uživatelé |
| **orders_only** | Dashboard + objednávky |

---

## Dashboard

Přehled objednávek dnes, tržby měsíc, počet produktů, nízký sklad. Odkazy na poslední objednávky.

---

## Produkty

- **Seznam** — hledání, mobilní karty, stav aktivní/skrytý
- **Nový produkt** — formulář, po uložení nahrajte fotky na detailu
- **Fotky** — Cloudinary upload (vyžaduje env klíče)
- **Smazání** — confirm dialog (nevratné)

Pole **SKU** = interní kód skladu. **Původní cena** = přeškrtnutá cena na webu (sleva).

---

## Kategorie

Vytvoření a úprava kategorií. Slug musí být URL-friendly (`mydla`, `sampony`).

---

## Objednávky

- Filtr podle stavu (nová, zaplaceno, odesláno…)
- Detail: zákazník, položky, Stripe ID, změna stavu + interní poznámka

Stavy: `new` → `paid` → `processing` → `shipped` → `completed`

---

## Novinky (blog)

Draft / published. Publikované články jsou na `/novinky`. Slug = URL segment.

---

## Reference

Aktivní reference se zobrazí na `/reference`. Hodnocení 1–5 hvězdiček, pořadí `sort_order`.

---

## Právní texty

⚠️ **Šablony** — úpravy v adminu se promítnou na veřejné stránky OP, GDPR, cookies, reklamační řád. Finální znění musí schválit právník.

---

## Nastavení obchodu

- Kontakt, adresa, e-mail, telefon
- **IČO, DIČ** — zobrazí se v patičce
- Doprava (`flatRate`, `freeShippingThreshold` v JSON)
- Homepage obsah (`homepage_content` — sekce O nás)
- Sociální sítě (Instagram, Facebook…)

---

## Uživatelé

Pouze role **admin**. Změna role existujícího účtu (nové účty vytvářejte v Supabase Auth dashboardu).

---

## Tipy

- Po změně produktu může trvat okamžik než se projeví na webu (SSR)
- Při problémech s fotkami zkontrolujte Cloudinary env a `docs/AUDIT-FAZE-1-4.md`
- Audit log admin akcí — tabulka `audit_logs` v Supabase

---

## Bezpečnost

- Neposílejte heslo e-mailem
- Odhlášení tlačítkem v admin headeru
- Rate limit na login (5 pokusů/min)
