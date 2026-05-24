-- Korunní Byliny — initial schema
-- Run via: supabase db push (or apply in Supabase SQL editor)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE public.order_status AS ENUM (
  'new',
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'returned'
);

CREATE TYPE public.admin_role AS ENUM (
  'admin',
  'editor',
  'orders_only'
);

CREATE TYPE public.blog_status AS ENUM (
  'draft',
  'published'
);

CREATE TYPE public.invoice_status AS ENUM (
  'draft',
  'issued',
  'sent',
  'paid',
  'cancelled'
);

-- Utility: updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- admin_profiles must exist before RLS helper functions reference it
CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role public.admin_role NOT NULL DEFAULT 'editor',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_profiles_role ON public.admin_profiles (role, is_active);

-- Admin helpers (SECURITY DEFINER — use auth.uid())
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS public.admin_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admin_profiles
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(allowed_roles public.admin_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role = ANY (allowed_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_catalog()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_admin_role(ARRAY['admin', 'editor']::public.admin_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_orders()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_admin_role(ARRAY['admin', 'orders_only']::public.admin_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_settings()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_admin_role(ARRAY['admin']::public.admin_role[]);
$$;

-- product_categories
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  seo_title text,
  seo_description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_categories_slug ON public.product_categories (slug);
CREATE INDEX idx_product_categories_active ON public.product_categories (is_active, sort_order);

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.product_categories (id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  stock_quantity int NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold int NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  sku text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  seo_title text,
  seo_description text,
  weight_grams int CHECK (weight_grams IS NULL OR weight_grams > 0),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON public.products (slug);
CREATE INDEX idx_products_category ON public.products (category_id);
CREATE INDEX idx_products_active ON public.products (is_active, is_featured);

-- product_images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  url text NOT NULL,
  public_id text,
  alt_text text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON public.product_images (product_id, sort_order);

-- product_variants
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity int NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON public.product_variants (product_id);

-- customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON public.customers (email);

-- orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers (id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'new',
  subtotal numeric(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping_cost numeric(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  discount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total numeric(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  currency text NOT NULL DEFAULT 'CZK',
  shipping_address jsonb NOT NULL DEFAULT '{}',
  billing_address jsonb NOT NULL DEFAULT '{}',
  customer_note text,
  admin_note text,
  stripe_payment_intent_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  invoice_status text NOT NULL DEFAULT 'pending',
  gdpr_consent boolean NOT NULL DEFAULT false,
  terms_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON public.orders (order_number);
CREATE INDEX idx_orders_status ON public.orders (status, created_at DESC);
CREATE INDEX idx_orders_customer ON public.orders (customer_id);

-- Order number generator: KB-YYYYMMDD-XXXX (after orders table exists)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  seq int;
  today text;
BEGIN
  today := TO_CHAR(NOW() AT TIME ZONE 'Europe/Prague', 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq
  FROM public.orders
  WHERE created_at::date = (NOW() AT TIME ZONE 'Europe/Prague')::date;
  RETURN 'KB-' || today || '-' || LPAD(seq::text, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_set_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- order_items
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products (id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants (id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text,
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price numeric(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON public.order_items (order_id);

-- payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'stripe',
  provider_payment_id text,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'CZK',
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON public.payments (order_id);

-- invoices
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'manual',
  provider_invoice_id text,
  invoice_number text,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  pdf_url text,
  issued_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_order ON public.invoices (order_id);

-- blog_posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  status public.blog_status NOT NULL DEFAULT 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  author_id uuid REFERENCES public.admin_profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts (status, published_at DESC);

-- testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  content text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- site_settings (singleton)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text NOT NULL DEFAULT 'Korunní Byliny',
  shop_email text NOT NULL DEFAULT 'info@korunni-byliny.cz',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  ico text,
  dic text,
  bank_account text,
  social_links jsonb NOT NULL DEFAULT '{}',
  shipping_config jsonb NOT NULL DEFAULT '{"flatRate": 99, "freeShippingThreshold": 1500}',
  payment_methods jsonb NOT NULL DEFAULT '{"stripe": true, "gopay": false}',
  homepage_content jsonb NOT NULL DEFAULT '{}',
  footer_content jsonb NOT NULL DEFAULT '{}',
  cookie_settings jsonb NOT NULL DEFAULT '{}',
  analytics_config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- legal_pages
CREATE TABLE public.legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legal_pages_slug ON public.legal_pages (slug);

-- audit_logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.admin_profiles (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);

-- updated_at triggers
CREATE TRIGGER trg_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create admin profile on auth.users insert (service role / dashboard signup)
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.admin_role, 'editor'),
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read: active categories
CREATE POLICY "public_read_active_categories"
  ON public.product_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "admin_manage_categories"
  ON public.product_categories FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Public read: active products
CREATE POLICY "public_read_active_products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "admin_manage_products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Product images: public if product active
CREATE POLICY "public_read_product_images"
  ON public.product_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = true
    )
  );

CREATE POLICY "admin_manage_product_images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Product variants
CREATE POLICY "public_read_product_variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = true
    )
  );

CREATE POLICY "admin_manage_product_variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Customers: admin/orders only
CREATE POLICY "admin_read_customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_manage_customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

-- Orders
CREATE POLICY "admin_read_orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_update_orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_insert_orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

-- Order items
CREATE POLICY "admin_read_order_items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    public.can_manage_orders()
    OR public.has_admin_role(ARRAY['admin']::public.admin_role[])
  );

CREATE POLICY "admin_manage_order_items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

-- Payments & invoices: admin + orders
CREATE POLICY "admin_read_payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_manage_payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_read_invoices"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (public.can_manage_orders() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_manage_invoices"
  ON public.invoices FOR ALL
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

-- Blog: public published, admin/editor CRUD
CREATE POLICY "public_read_published_blog"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "admin_read_all_blog"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (public.can_manage_catalog());

CREATE POLICY "admin_manage_blog"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Testimonials
CREATE POLICY "public_read_active_testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "admin_manage_testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (public.can_manage_catalog())
  WITH CHECK (public.can_manage_catalog());

-- Site settings: public read, admin write
CREATE POLICY "public_read_site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_manage_site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.can_manage_settings())
  WITH CHECK (public.can_manage_settings());

-- Legal pages: public read, admin write
CREATE POLICY "public_read_legal_pages"
  ON public.legal_pages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_manage_legal_pages"
  ON public.legal_pages FOR ALL
  TO authenticated
  USING (public.can_manage_settings())
  WITH CHECK (public.can_manage_settings());

-- Admin profiles
CREATE POLICY "admin_read_own_profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_manage_profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]))
  WITH CHECK (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

-- Audit logs: admin only
CREATE POLICY "admin_read_audit_logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.has_admin_role(ARRAY['admin']::public.admin_role[]));

CREATE POLICY "admin_insert_audit_logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Service role bypasses RLS by default when using service role key
