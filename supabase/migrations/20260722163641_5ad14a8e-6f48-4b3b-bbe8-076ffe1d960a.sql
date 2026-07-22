
CREATE TABLE public.redirects (
  from_path text PRIMARY KEY,
  to_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redirects TO anon, authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redirects readable by all" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "admins manage redirects" ON public.redirects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.broken_links (
  path text PRIMARY KEY,
  suggested text,
  source_post_id bigint,
  checked_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.broken_links TO authenticated;
GRANT ALL ON public.broken_links TO service_role;
ALTER TABLE public.broken_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read broken links" ON public.broken_links FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage broken links" ON public.broken_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
