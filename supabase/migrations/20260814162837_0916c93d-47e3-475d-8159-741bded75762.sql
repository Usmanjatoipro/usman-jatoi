CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE INDEX IF NOT EXISTS wp_posts_title_trgm_idx ON public.wp_posts USING gin (title extensions.gin_trgm_ops);