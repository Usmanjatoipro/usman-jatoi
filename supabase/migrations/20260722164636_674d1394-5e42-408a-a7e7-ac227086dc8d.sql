
UPDATE public.wp_posts
SET seo_title = COALESCE(NULLIF(meta->'meta_title'->>0, ''), seo_title),
    seo_description = COALESCE(NULLIF(meta->'meta_description'->>0, ''), seo_description)
WHERE meta ? 'meta_title' OR meta ? 'meta_description';
