CREATE UNIQUE INDEX IF NOT EXISTS broken_links_path_key ON public.broken_links (path);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.broken_links TO authenticated;
GRANT ALL ON public.broken_links TO service_role;