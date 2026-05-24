# Supabase — nastavení pro Korunní Byliny

## 1. Vytvoření projektu

1. Přihlaste se na [supabase.com](https://supabase.com)
2. Vytvořte nový projekt (region: EU — Frankfurt doporučeno)
3. Z **Project Settings → API** zkopírujte:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (pouze server, nikdy na klienta)

## 2. Environment variables

```bash
cp .env.example .env.local
# Doplňte Supabase hodnoty
```

## 3. Migrace databáze

### Varianta A: Supabase CLI (doporučeno)

```bash
npm install -g supabase
supabase login
supabase link --project-ref VAS_PROJECT_REF
supabase db push
```

### Varianta B: SQL Editor

1. Otevřete **SQL Editor** v Supabase dashboardu
2. Pokud předchozí migrace spadla uprostřed, nejdřív spusťte `supabase/scripts/cleanup-failed-migration.sql` (nebo reset DB v dev projektu)
3. Spusťte obsah souboru `supabase/migrations/20260524000000_initial_schema.sql`
4. Spusťte obsah souboru `supabase/seed.sql`

## 4. Vytvoření admin uživatele

1. V Supabase dashboardu: **Authentication → Users → Add user**
2. E-mail: `admin@korunni-byliny.cz` (nebo vlastní)
3. Heslo: min. 8 znaků
4. Trigger automaticky vytvoří záznam v `admin_profiles`

Nastavení role admin:

```sql
UPDATE public.admin_profiles
SET role = 'admin', full_name = 'Hlavní administrátor'
WHERE email = 'admin@korunni-byliny.cz';
```

## 5. Auth redirect URLs

V **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` (dev) / `https://vase-domena.cz` (prod)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://vase-domena.cz/auth/callback`

## 6. Ověření

```bash
npm run dev
```

- Veřejný web: http://localhost:3000 — kategorie a produkty ze seed dat
- Admin login: http://localhost:3000/admin/login

## Role

| Role | Oprávnění |
|------|-----------|
| `admin` | Vše včetně nastavení a uživatelů |
| `editor` | Produkty, kategorie, blog, reference, obsah |
| `orders_only` | Pouze objednávky |

## Bezpečnost

- `SUPABASE_SERVICE_ROLE_KEY` používejte **pouze** na serveru (webhooky, checkout ve fázi 4)
- RLS je aktivní na všech tabulkách
- V produkci vypněte signup v Auth settings (`enable_signup = false` — viz `supabase/config.toml`)
