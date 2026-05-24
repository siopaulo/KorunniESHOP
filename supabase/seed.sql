-- Seed data for development
-- Apply after migration. Create admin user via Supabase Auth dashboard first,
-- then update role: UPDATE admin_profiles SET role = 'admin' WHERE email = 'admin@korunni-byliny.cz';

-- Site settings singleton
INSERT INTO public.site_settings (
  id,
  shop_name,
  shop_email,
  phone,
  address,
  social_links,
  homepage_content
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Korunní Byliny',
  'info@korunni-byliny.cz',
  '+420 123 456 789',
  'Korunní, Praha 2',
  '{"instagram": "https://instagram.com/korunni-byliny", "facebook": "https://facebook.com/korunni-byliny"}'::jsonb,
  '{"heroTitle": "Bylinná péče s duší přírody", "storyTitle": "Tradice, která voní bylinkami"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Legal pages (templates)
INSERT INTO public.legal_pages (slug, title, content) VALUES
  ('terms', 'Obchodní podmínky', '⚠️ Šablona — finální znění musí schválit právník.'),
  ('privacy', 'Ochrana osobních údajů', '⚠️ Šablona GDPR — finální znění musí schválit právník.'),
  ('cookies', 'Zásady cookies', '⚠️ Šablona — finální znění musí schválit právník.'),
  ('returns', 'Reklamační řád', '⚠️ Šablona — finální znění musí schválit právník.')
ON CONFLICT (slug) DO NOTHING;

-- Categories
INSERT INTO public.product_categories (id, name, slug, description, sort_order, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Bylinná mýdla', 'mydla', 'Ručně míchaná mýdla z přírodních olejí a bylin', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Bylinné šampony', 'sampony', 'Šetrná péče o vlasy bez chemie', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Masti a balzámy', 'masticky', 'Koncentrovaná síla bylin pro pokožku', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Elixíry', 'elixiry', 'Bylinné kapky a tinktury', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Products (6+ across 3 categories)
INSERT INTO public.products (
  id, category_id, name, slug, short_description, description,
  price, compare_at_price, stock_quantity, sku, is_active, is_featured, tags
) VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'Mýdlo s levandulí',
    'mydlo-s-levanduli',
    'Uklidňující mýdlo s esenciálním olejem z levandule',
    'Ručně vyráběné mýdlo z olivového oleje, bambuckého másla a levandule z Korunní. Jemně čistí a zklidňuje pokožku.',
    189, NULL, 24, 'MYD-LAV-001', true, true, ARRAY['bestseller']
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111101',
    'Mýdlo s kopřivou a zeleným jílem',
    'mydlo-kopriva-jil',
    'Detoxikační mýdlo pro normální a mastnou pokožku',
    'Kopřiva a zelený jíl v kombinaci s konopným olejem pro svěží a čistou pokožku.',
    199, 229, 18, 'MYD-KOP-002', true, false, ARRAY['sleva']
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111102',
    'Šampon s heřmánkem',
    'sampon-s-hermanekem',
    'Jemný šampon pro citlivou pokožku hlavy',
    'Bez sulfátů, s extraktem z heřmánku a aloe vera. Zklidňuje a hydratuje.',
    349, NULL, 15, 'SAM-HER-001', true, true, ARRAY['novinka', 'bestseller']
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111102',
    'Šampon s kopřivou',
    'sampon-s-koprivou',
    'Posilující péče pro normální vlasy',
    'Kopřiva a rozmarýn podporují zdravý vzhled vlasů a lesk.',
    329, NULL, 20, 'SAM-KOP-002', true, false, ARRAY[]::text[]
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111103',
    'Mast s kalendulou',
    'mast-s-kalendulou',
    'Hojivá mast pro suchou a podrážděnou pokožku',
    'Kalendula, měsíček a včelí vosk v tradiční receptuře z Korunní.',
    279, NULL, 12, 'MAS-KAL-001', true, true, ARRAY['bestseller']
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111103',
    'Balzám na rty s propolisem',
    'balzam-na-rty-propolis',
    'Výživný balzám s propolisem a včelím voskem',
    'Chrání rty před vysušením, obnovuje přirozenou bariéru.',
    129, NULL, 30, 'BAL-PRO-002', true, false, ARRAY['novinka']
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    '11111111-1111-1111-1111-111111111104',
    'Elixír z meduňky',
    'elixir-medunka',
    'Bylinné kapky pro klidný večer',
    'Tinktura z čerstvé meduňky sbírané v okolí Korunní. 50 ml.',
    399, NULL, 10, 'ELI-MED-001', true, true, ARRAY['novinka']
  )
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (author_name, content, rating, is_active, sort_order) VALUES
  ('Marie K.', 'Mýdlo s levandulí je naprostá bomba. Pokožka je jemná a voní celý byt.', 5, true, 1),
  ('Jana P.', 'Konečně šampon, který mi nedráždí pokožku hlavy. Doporučuji!', 5, true, 2),
  ('Tomáš H.', 'Mast s kalendulou nám pomohla s ekzémem u syna. Skvělá kvalita.', 4, true, 3)
ON CONFLICT DO NOTHING;

-- Blog post sample
INSERT INTO public.blog_posts (title, slug, excerpt, content, status, published_at) VALUES
  (
    'Jak sbírat byliny v Korunní',
    'jak-sbirat-byliny-v-korunni',
    'Tipy pro sběr bylin v městské zeleni s respektem k přírodě.',
    'Sběr bylin v okolí Korunní má dlouhou tradici. V tomto článku se dozvíte, kdy a jak sbírat bezpečně a udržitelně.',
    'published',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

UPDATE public.admin_profiles
SET role = 'admin', full_name = 'Hlavní administrátor'
WHERE email = 'admin@korunni-byliny.cz';