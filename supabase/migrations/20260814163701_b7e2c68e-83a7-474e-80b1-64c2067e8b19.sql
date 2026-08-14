ALTER TABLE public.wp_posts ADD COLUMN IF NOT EXISTS content_html text;
CREATE INDEX IF NOT EXISTS wp_posts_path_idx ON public.wp_posts (path);