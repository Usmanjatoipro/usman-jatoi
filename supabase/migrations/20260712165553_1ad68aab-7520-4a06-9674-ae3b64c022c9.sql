
-- === Roles (separate table, avoids privilege escalation) ===
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- === Media library ===
CREATE TABLE public.wp_media (
  id BIGINT PRIMARY KEY,                  -- WordPress media ID
  slug TEXT,
  title TEXT,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  mime_type TEXT,
  source_url TEXT NOT NULL,               -- Original WordPress URL
  storage_path TEXT,                      -- Path inside Lovable Cloud Storage bucket
  storage_url TEXT,                       -- Public URL we serve
  width INT,
  height INT,
  filesize BIGINT,
  media_date TIMESTAMPTZ,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  imported_at TIMESTAMPTZ,                -- NULL until file is re-hosted
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wp_media_imported_idx ON public.wp_media (imported_at) WHERE imported_at IS NULL;
GRANT SELECT ON public.wp_media TO anon, authenticated;
GRANT ALL ON public.wp_media TO service_role;
ALTER TABLE public.wp_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.wp_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write media" ON public.wp_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- === Posts / pages / CPTs (one table, discriminated by post_type) ===
CREATE TABLE public.wp_posts (
  id BIGINT PRIMARY KEY,                  -- WordPress post ID
  post_type TEXT NOT NULL,                -- post, page, product, courses, etc.
  status TEXT NOT NULL DEFAULT 'publish',
  slug TEXT NOT NULL,
  title TEXT,
  excerpt TEXT,
  content TEXT,                           -- Rendered HTML
  permalink TEXT,                         -- Full URL from WordPress
  path TEXT,                              -- Path only (relative)
  parent_id BIGINT,
  menu_order INT DEFAULT 0,
  author_id BIGINT,
  featured_media_id BIGINT,               -- Refers wp_media.id (no FK to allow arbitrary order)
  post_date TIMESTAMPTZ,
  post_modified TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wp_posts_type_idx ON public.wp_posts (post_type);
CREATE INDEX wp_posts_slug_idx ON public.wp_posts (post_type, slug);
CREATE INDEX wp_posts_path_idx ON public.wp_posts (path);
CREATE INDEX wp_posts_parent_idx ON public.wp_posts (parent_id);
CREATE INDEX wp_posts_date_idx ON public.wp_posts (post_date DESC);
GRANT SELECT ON public.wp_posts TO anon, authenticated;
GRANT ALL ON public.wp_posts TO service_role;
ALTER TABLE public.wp_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON public.wp_posts FOR SELECT TO anon, authenticated
  USING (status = 'publish');
CREATE POLICY "Admins write posts" ON public.wp_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- === Taxonomies & terms ===
CREATE TABLE public.wp_terms (
  id BIGINT PRIMARY KEY,
  taxonomy TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT,
  description TEXT,
  parent_id BIGINT,
  count INT DEFAULT 0,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wp_terms_taxonomy_idx ON public.wp_terms (taxonomy);
CREATE INDEX wp_terms_slug_idx ON public.wp_terms (taxonomy, slug);
GRANT SELECT ON public.wp_terms TO anon, authenticated;
GRANT ALL ON public.wp_terms TO service_role;
ALTER TABLE public.wp_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read terms" ON public.wp_terms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write terms" ON public.wp_terms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.wp_post_terms (
  post_id BIGINT NOT NULL,
  term_id BIGINT NOT NULL,
  taxonomy TEXT NOT NULL,
  PRIMARY KEY (post_id, term_id)
);
CREATE INDEX wp_post_terms_term_idx ON public.wp_post_terms (term_id);
GRANT SELECT ON public.wp_post_terms TO anon, authenticated;
GRANT ALL ON public.wp_post_terms TO service_role;
ALTER TABLE public.wp_post_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read post_terms" ON public.wp_post_terms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write post_terms" ON public.wp_post_terms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- === Import state (resumable cursors) ===
CREATE TABLE public.wp_import_state (
  content_kind TEXT PRIMARY KEY,          -- 'posts', 'pages', 'media', 'product', 'courses', 'categories', 'tags'
  last_page INT NOT NULL DEFAULT 0,
  total_pages INT,
  total_items INT,
  imported_items INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'idle',    -- idle, running, done, error
  last_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wp_import_state TO anon, authenticated;
GRANT ALL ON public.wp_import_state TO service_role;
ALTER TABLE public.wp_import_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read import state" ON public.wp_import_state FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write import state" ON public.wp_import_state FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- === updated_at trigger ===
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER wp_posts_touch BEFORE UPDATE ON public.wp_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER wp_media_touch BEFORE UPDATE ON public.wp_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER wp_import_state_touch BEFORE UPDATE ON public.wp_import_state FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- === Seed known content kinds ===
INSERT INTO public.wp_import_state (content_kind, total_items) VALUES
  ('media', 609),
  ('posts', 16919),
  ('pages', 21798),
  ('product', 3),
  ('courses', 1),
  ('categories', NULL),
  ('tags', NULL)
ON CONFLICT DO NOTHING;
