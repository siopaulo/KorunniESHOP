-- Fáze 7: kontaktní zprávy, mail log, reference is_verified, odstoupení v legal_pages
-- NESPOUŠTĚT na produkci bez potvrzení provozovatele.

-- =============================================================
-- contact_messages
-- =============================================================
CREATE TYPE public.contact_message_status AS ENUM (
  'new',
  'in_progress',
  'resolved',
  'archived'
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  gdpr_consent boolean NOT NULL DEFAULT false,
  status public.contact_message_status NOT NULL DEFAULT 'new',
  internal_note text,
  order_number text,
  source text NOT NULL DEFAULT 'contact_form',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON public.contact_messages (status, created_at DESC);

-- =============================================================
-- contact_message_replies
-- =============================================================
CREATE TABLE IF NOT EXISTS public.contact_message_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_message_id uuid REFERENCES public.contact_messages (id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  sent_at timestamptz,
  provider text NOT NULL DEFAULT 'resend',
  provider_error text,
  created_by uuid REFERENCES public.admin_profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_message_replies_message
  ON public.contact_message_replies (contact_message_id);

-- =============================================================
-- mail_log (audit odeslaných e-mailů z adminu)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.mail_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_message_id uuid REFERENCES public.contact_messages (id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  template_key text,
  status text NOT NULL DEFAULT 'draft',
  provider text NOT NULL DEFAULT 'resend',
  provider_error text,
  created_by uuid REFERENCES public.admin_profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mail_log_created
  ON public.mail_log (created_at DESC);

-- =============================================================
-- testimonials — ověřený zákazník
-- =============================================================
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- =============================================================
-- legal_pages — odstoupení
-- =============================================================
INSERT INTO public.legal_pages (slug, title, content)
VALUES ('withdrawal', 'Odstoupení od smlouvy', '')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================
-- updated_at trigger for contact_messages
-- =============================================================
CREATE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================
-- RLS
-- =============================================================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_contact_messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin_all_contact_messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_all_contact_message_replies"
  ON public.contact_message_replies FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_all_mail_log"
  ON public.mail_log FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
