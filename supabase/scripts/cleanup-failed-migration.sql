-- Cleanup after failed partial migration (DEV ONLY)
-- Run manually in Supabase SQL Editor BEFORE re-running initial_schema.sql

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_admin_user() CASCADE;
DROP FUNCTION IF EXISTS public.set_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.can_manage_settings() CASCADE;
DROP FUNCTION IF EXISTS public.can_manage_orders() CASCADE;
DROP FUNCTION IF EXISTS public.can_manage_catalog() CASCADE;
DROP FUNCTION IF EXISTS public.has_admin_role(public.admin_role[]) CASCADE;
DROP FUNCTION IF EXISTS public.get_admin_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.legal_pages CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.admin_profiles CASCADE;

DROP TYPE IF EXISTS public.invoice_status CASCADE;
DROP TYPE IF EXISTS public.blog_status CASCADE;
DROP TYPE IF EXISTS public.admin_role CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
