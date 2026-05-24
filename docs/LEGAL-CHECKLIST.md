# Legal checklist — pro právníka a účetní

> ⚠️ Všechny texty v e-shopu jsou **implementační šablony**. Před go-live musí být schváleny odborníkem.

---

## Co je v systému připraveno

| Položka | Admin editace | Veřejná URL |
|---------|---------------|-------------|
| Obchodní podmínky | ✅ Právní texty | `/obchodni-podminky` |
| Ochrana osobních údajů | ✅ | `/ochrana-osobnich-udaju` |
| Cookies | ✅ | `/cookies` |
| Reklamační řád | ✅ | `/reklamacni-rad` |
| Cookie lišta (kategorie) | — | všechny stránky |
| Souhlas OP + GDPR při objednávce | — | `/pokladna` (povinné checkboxy) |
| IČO / DIČ v patičce | ✅ Nastavení | footer |

---

## Co musí dodat právník / účetní

1. Obchodní podmínky e-shopu (B2C, ČR)
2. Zásady ochrany osobních údajů (GDPR, zpracovatelé: Supabase, Stripe, Resend, Cloudinary)
3. Cookie policy (nezbytné vs analytické)
4. Reklamační řád a postup (14 dní odstoupení)
5. Informace o právu na odstoupení u spotřebního zboží
6. Fakturační údaje provozovatele (sídlo, IČO, DIČ)
7. DPH sazby pro sortiment (kosmetika / bylinné produkty)
8. Smlouva / podmínky Stripe
9. DPA se Supabase
10. Zpracování objednávkových dat (doba uchování)

---

## Technické poznámky pro review

- Objednávka ukládá `terms_consent` a `gdpr_consent` s časovým razítkem
- Cookie souhlas v `localStorage` klíč `korunni-cookie-consent` (JSON: essential + analytics)
- Analytické cookies se **nespouštějí** bez souhlasu (připraveno pro budoucí GA/Plausible)
- E-maily přes Resend — ověřit účel zpracování v GDPR

---

## Go-live gate

- [ ] Právník schválil finální texty v adminu
- [ ] Účetní ověřil IČO/DIČ a DPH
- [ ] Cookie lišta odpovídá cookie policy
- [ ] Checkboxy na pokladně odpovídají OP a GDPR
