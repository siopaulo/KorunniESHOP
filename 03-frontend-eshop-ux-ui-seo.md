# Fáze 3: Frontend e-shop, UX/UI a SEO

## Cíl fáze

Vytvořit prémiový veřejný frontend e-shopu s kompletní UX, responzivním designem, SEO optimalizací a strukturovanými daty. Design musí působit přírodně, řemeslně a důvěryhodně — identita bylinné značky z Korunní.

## Rozsah práce

- Homepage (hero, kategorie, produkty, příběh, reference, novinky, CTA)
- Katalog produktů s filtrováním a řazením
- Kategorie produktů
- Detail produktu (galerie, cena, sleva, sklad, přidání do košíku)
- Košík (client state + persist)
- Checkout UI (formuláře, souhlasy)
- Stránky úspěchu/neúspěchu objednávky
- Blog/novinky (seznam + detail)
- Reference
- O nás
- Kontakt (formulář)
- Právní stránky (dynamický obsah z DB)
- Navigace, patička, breadcrumbs
- Loading, error, empty states
- SEO metadata, OG, Twitter cards
- JSON-LD structured data
- Cookie consent banner (GDPR)
- Newsletter signup (placeholder)
- Optimalizace obrázků

## Technická rozhodnutí

### Design identita

**Název**: Korunní Byliny  
**Tagline**: „Domácí bylinné produkty z srdce Korunní"

**Vizuální jazyk**:
- Jemné botanické ilustrace / SVG patterns (decentní)
- Velké produktové fotografie s jemným stínem
- Karty s `rounded-2xl`, jemný border `border-sage/20`
- Hover animace: jemný scale + shadow (Framer Motion)
- Sekce střídají `cream` a `white` pozadí

**Komponenty**:
- `ProductCard` — obrázek, název, cena, sleva badge, sklad indicator
- `CategoryCard` — obrázek overlay s názvem
- `HeroSection` — full-width, CTA, botanický accent
- `TestimonialCarousel` — reference s hvězdičkami
- `BlogCard` — excerpt, datum, cover
- `PriceDisplay` — formát CZK, přeškrtnutá původní cena
- `StockBadge` — skladem / poslední kusy / vyprodáno
- `Breadcrumbs` — s JSON-LD

### Košík

- **Zustand** nebo React Context + localStorage persist
- Server-side košík až při checkoutu (fáze 4)
- Validace skladu před checkoutem

### Routing (veřejné)

| URL | Stránka |
|-----|---------|
| `/` | Homepage |
| `/produkty` | Katalog |
| `/produkty/[slug]` | Detail produktu |
| `/kategorie/[slug]` | Kategorie |
| `/kosik` | Košík |
| `/pokladna` | Checkout |
| `/objednavka/uspech` | Úspěch |
| `/objednavka/neuspech` | Neúspěch |
| `/novinky` | Blog seznam |
| `/novinky/[slug]` | Blog detail |
| `/reference` | Reference |
| `/o-nas` | O nás |
| `/kontakt` | Kontakt |
| `/obchodni-podminky` | Legal |
| `/ochrana-osobnich-udaju` | Legal |
| `/cookies` | Legal |
| `/reklamacni-rad` | Legal |

### SEO implementace

```typescript
// generateMetadata pro dynamické stránky
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_description,
    openGraph: { ... },
    alternates: { canonical: `${siteUrl}/produkty/${product.slug}` },
  };
}
```

**JSON-LD typy**:
- `Product` — detail produktu
- `Organization` — homepage
- `BreadcrumbList` — navigace
- `BlogPosting` — články
- `WebSite` + `SearchAction` — homepage

### Přístupnost

- Semantic HTML (`main`, `nav`, `article`)
- Focus visible states
- ARIA labels na interaktivních prvcích
- Kontrast min. WCAG AA
- Formuláře s `label` + `error` propojením
- Skip to content link
- Reduced motion respekt (`prefers-reduced-motion`)

### Performance

- RSC pro produktové seznamy a detaily
- `next/image` s Cloudinary loader
- Dynamic import pro CookieBanner, Newsletter
- Font subsetting (latin, latin-ext pro češtinu)
- Lazy load below-fold sekce

## Checklist úkolů

### Layout a navigace
- [ ] Header s logo, navigací, košík ikonou + count
- [ ] Mobile menu (sheet/drawer)
- [ ] Footer s odkazy, kontaktem, sociálními sítěmi
- [ ] Skip to content

### Homepage
- [ ] Hero section s CTA
- [ ] Sekce kategorií (grid)
- [ ] Vybrané produkty (featured)
- [ ] Příběh značky z Korunní
- [ ] Benefity (ikony + text)
- [ ] Reference preview
- [ ] Novinky preview
- [ ] Newsletter CTA
- [ ] Animace při scroll (Framer Motion, stagger)

### Produktový katalog
- [ ] Grid produktů s ProductCard
- [ ] Filtr podle kategorie
- [ ] Řazení (cena, novinka, název)
- [ ] Pagination nebo infinite scroll
- [ ] Empty state (žádné produkty)
- [ ] Loading skeleton

### Detail produktu
- [ ] Galerie obrázků (thumbnail + main)
- [ ] Název, popis, cena, sleva
- [ ] Stock indicator
- [ ] Tags (novinka, bestseller)
- [ ] Přidat do košíku + quantity
- [ ] Breadcrumbs
- [ ] JSON-LD Product
- [ ] Související produkty

### Košík
- [ ] Seznam položek, quantity edit, remove
- [ ] Souhrn (mezisoučet, doprava placeholder)
- [ ] Empty cart state
- [ ] CTA na checkout
- [ ] Persist localStorage

### Checkout UI
- [ ] Kontaktní údaje formulář (RHF + Zod)
- [ ] Dodací adresa
- [ ] Fakturační adresa (stejná/jiná)
- [ ] Souhlas s OP a GDPR checkboxy
- [ ] Souhrn objednávky
- [ ] Loading state při odeslání

### Obsahové stránky
- [ ] Blog seznam + detail (Markdown render)
- [ ] Reference stránka
- [ ] O nás (editovatelný obsah)
- [ ] Kontakt (formulář + mapa/info placeholder)
- [ ] Legal stránky (dynamic z DB)

### SEO a technické
- [ ] `sitemap.ts` dynamický
- [ ] `robots.ts`
- [ ] OG images (default + per product)
- [ ] JSON-LD komponenty
- [ ] Cookie consent banner
- [ ] 404 stránka (custom design)
- [ ] Error boundary stránka

## Akceptační kritéria

1. Všechny veřejné stránky fungují s reálnými daty ze Supabase
2. Responzivní design — mobile first, testováno 320px–1920px
3. Košík persistuje mezi relacemi
4. Lighthouse Performance > 90 na homepage (dev data)
5. Lighthouse Accessibility > 95
6. Lighthouse SEO > 95
7. JSON-LD validní (Google Rich Results Test)
8. Cookie banner blokuje neesenciální cookies do souhlasu
9. Všechny formuláře validované, accessible
10. Design působí prémiově a jedinečně (ne generický template)

## Bezpečnostní poznámky

- XSS: sanitizace HTML obsahu (blog, legal) — DOMPurify nebo MDX
- Košík data pouze non-sensitive na klientu
- Kontaktní formulář — rate limit + honeypot
- CSP headers pro inline scripts

## SEO / Performance poznámky

- Každá stránka má unikátní title a description
- Canonical URLs na všech stránkách
- Hreflang připraven (cs) pro budoucí lokalizaci
- Image alt texty z adminu
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

## Co bude hotové na konci fáze

- Kompletní veřejný e-shop UI
- SEO a structured data
- Košík a checkout formulář (UI)
- Cookie consent
- Připravenost pro fázi 4 (platby, objednávky backend)
