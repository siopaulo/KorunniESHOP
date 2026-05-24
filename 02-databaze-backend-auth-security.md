# Fáze 2: Databáze, backend, auth a security

## Cíl fáze

Vybudovat bezpečný backendový základ — Supabase databázi s RLS, autentizaci adminů s rolemi, server-side validaci, middleware ochranu a Sentry integraci. Výstupem je funkční datová vrstva připravená pro frontend a admin.

## Rozsah práce

- Supabase projektová struktura (`supabase/migrations/`)
- Databázové schéma a vztahy
- Row Level Security policies
- Supabase Auth pro admin
- Role: admin, editor, orders-only
- Zod schemas pro všechny entity
- Server Actions / API helpers
- Middleware pro auth a admin routes
- Audit logy
- Seed data (testovací produkty, kategorie)
- Sentry integrace
- Error handling patterns

## Technická rozhodnutí

### Supabase klienti

- **Browser client** (`createBrowserClient`) — pouze veřejná data, anon key
- **Server client** (`createServerClient`) — cookies, RLS jako přihlášený user
- **Service role client** — pouze server-side pro webhooky, admin operace mimo RLS (s opatrností)

### Datový model

```
product_categories ──< products ──< product_images
                              └──< product_variants (optional)

customers ──< orders ──< order_items ──> products
                ├──< payments
                └──< invoices

blog_posts
testimonials
site_settings (singleton JSON)
legal_pages
admin_profiles (extends auth.users)
audit_logs
```

### Tabulky — detail

#### `product_categories`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| name | text | Název |
| slug | text UNIQUE | URL slug |
| description | text | Popis |
| image_url | text | Obrázek kategorie |
| seo_title | text | |
| seo_description | text | |
| sort_order | int | Pořadí |
| is_active | boolean | |
| created_at, updated_at | timestamptz | |

#### `products`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| category_id | uuid FK | |
| name, slug | text | |
| description, short_description | text | |
| price | numeric(10,2) | Cena v haléřích nebo CZK |
| compare_at_price | numeric | Původní cena (sleva) |
| stock_quantity | int | Sklad |
| low_stock_threshold | int | Upozornění |
| sku | text | |
| is_active | boolean | |
| is_featured | boolean | Vybrané produkty |
| tags | text[] | novinka, bestseller, sleva |
| seo_title, seo_description | text | |
| weight_grams | int | Pro dopravu |
| created_at, updated_at | timestamptz | |

#### `product_images`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| product_id | uuid FK | |
| url | text | Cloudinary URL |
| public_id | text | Cloudinary ID |
| alt_text | text | |
| sort_order | int | |
| is_primary | boolean | |

#### `product_variants` (volitelné)
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| product_id | uuid FK | |
| name | text | např. "50ml", "100ml" |
| sku | text | |
| price | numeric | |
| stock_quantity | int | |

#### `customers`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| email | text UNIQUE | |
| first_name, last_name | text | |
| phone | text | |
| created_at | timestamptz | |

#### `orders`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| order_number | text UNIQUE | Čitelné číslo objednávky |
| customer_id | uuid FK | |
| status | enum | viz stavy níže |
| subtotal, shipping_cost, discount, total | numeric | |
| currency | text DEFAULT 'CZK' | |
| shipping_address | jsonb | |
| billing_address | jsonb | |
| customer_note | text | |
| admin_note | text | |
| stripe_payment_intent_id | text | |
| payment_status | text | |
| invoice_status | text | pending, issued, sent |
| gdpr_consent | boolean | |
| terms_consent | boolean | |
| created_at, updated_at | timestamptz | |

**Stavy objednávky**: `new`, `awaiting_payment`, `paid`, `processing`, `shipped`, `completed`, `cancelled`, `returned`

#### `order_items`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| order_id | uuid FK | |
| product_id | uuid FK | |
| variant_id | uuid FK nullable | |
| product_name | text | Snapshot |
| product_sku | text | |
| quantity | int | |
| unit_price | numeric | |
| total_price | numeric | |

#### `payments`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| order_id | uuid FK | |
| provider | text | stripe, gopay |
| provider_payment_id | text | |
| amount | numeric | |
| currency | text | |
| status | text | |
| metadata | jsonb | |
| created_at | timestamptz | |

#### `invoices`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| order_id | uuid FK | |
| provider | text | manual, fakturoid, idoklad |
| provider_invoice_id | text | |
| invoice_number | text | |
| status | text | draft, issued, sent, paid |
| pdf_url | text | |
| issued_at | timestamptz | |

#### `blog_posts`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| title, slug | text | |
| excerpt, content | text | |
| cover_image_url | text | |
| status | enum | draft, published |
| seo_title, seo_description | text | |
| published_at | timestamptz | |
| author_id | uuid FK | |

#### `testimonials`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| author_name | text | |
| content | text | |
| rating | int 1-5 | |
| is_active | boolean | |
| sort_order | int | |

#### `site_settings`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | singleton |
| shop_name | text | |
| shop_email | text | |
| phone, address | text | |
| social_links | jsonb | |
| shipping_config | jsonb | |
| payment_methods | jsonb | |
| homepage_content | jsonb | |
| footer_content | jsonb | |
| cookie_settings | jsonb | |
| analytics_config | jsonb | placeholder |

#### `legal_pages`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| slug | text UNIQUE | terms, privacy, cookies, returns |
| title | text | |
| content | text | Markdown/HTML |
| updated_at | timestamptz | |

#### `admin_profiles`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | = auth.users.id |
| email | text | |
| full_name | text | |
| role | enum | admin, editor, orders_only |
| is_active | boolean | |
| created_at | timestamptz | |

#### `audit_logs`
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| action | text | |
| entity_type | text | |
| entity_id | uuid | |
| metadata | jsonb | |
| ip_address | text | |
| created_at | timestamptz | |

### RLS strategie

| Tabulka | Veřejnost | Admin |
|---------|-----------|-------|
| products (active) | SELECT | CRUD dle role |
| categories (active) | SELECT | CRUD |
| orders | — | SELECT/UPDATE dle role |
| site_settings | SELECT public fields | UPDATE admin |
| legal_pages | SELECT | UPDATE admin |
| blog_posts (published) | SELECT | CRUD editor+ |
| testimonials (active) | SELECT | CRUD |
| audit_logs | — | SELECT admin |

### Auth flow

1. Admin login přes Supabase Auth (email + password)
2. Middleware kontroluje session pro `/admin/*`
3. Role z `admin_profiles` — server-side check v actions
4. První admin vytvořen seed scriptem nebo Supabase dashboard

### Předpoklady

- Supabase free tier pro vývoj
- Ceny v **CZK** jako `numeric`, ukládání v haléřích (integer) nebo přímo CZK — rozhodnutí: **CZK decimal** pro jednoduchost
- Soft delete ne — hard delete s audit logem

## Checklist úkolů

- [x] Vytvořit Supabase migrace (všechny tabulky)
- [x] Enum typy pro order_status, user_role, blog_status
- [x] Indexy (slug, order_number, email, status)
- [x] RLS policies pro všechny tabulky
- [x] Trigger `updated_at` na tabulkách
- [x] Funkce generování order_number
- [x] Supabase klienty (browser, server, admin)
- [x] Middleware auth check
- [x] Admin login stránka
- [x] Role-based access helpers (`requireRole()`)
- [x] Zod schemas pro všechny entity
- [x] Seed script (kategorie, produkty, settings, legal templates)
- [x] Sentry init (client + server)
- [x] Global error boundary
- [x] Audit log helper
- [x] Rate limiting utility (pro API routes)
- [ ] Ověřit migraci a login lokálně s reálným Supabase projektem

## Progress log (fáze 2)

**Hotovo:** SQL migrace, seed, Supabase klienti, auth (login/logout/middleware/role), Zod, audit log, rate limit, Sentry, data layer, docs/SUPABASE.md

**Zbývá:** Lokální ověření s Supabase projektem → Fáze 3

## Akceptační kritéria

1. Migrace běží bez chyb (`supabase db push`)
2. RLS blokuje neautorizovaný přístup (testy manuální)
3. Admin login funguje, middleware chrání `/admin`
4. Role editor nemůže měnit settings, orders_only vidí jen objednávky
5. Seed data — min. 6 produktů ve 3 kategoriích
6. Zod validace odmítá nevalidní data
7. Sentry zachytí test error
8. Audit log se zapisuje při admin akcích

## Bezpečnostní poznámky

- Service role key **nikdy** na klienta
- RLS jako primární obrana, ne jen aplikační logika
- Prepared statements (Supabase default) — ochrana SQL injection
- Input sanitizace pro user-generated content (blog, legal)
- CSRF: Server Actions mají built-in ochranu Next.js
- Rate limit na login a checkout API
- Audit log pro všechny admin mutace
- Password policy přes Supabase config

## SEO / Performance poznámky

- DB dotazy optimalizované — select pouze potřebné sloupce
- Index na slug pro rychlé lookup produktů/kategorií
- Connection pooling (Supabase Supavisor)

## Co bude hotové na konci fáze

- Kompletní DB schéma s RLS
- Funkční admin auth s rolemi
- Seed data pro vývoj
- Validace a error handling
- Připravenost pro fázi 3 (veřejný frontend s reálnými daty)
