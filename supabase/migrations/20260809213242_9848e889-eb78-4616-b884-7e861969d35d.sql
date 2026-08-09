CREATE OR REPLACE FUNCTION public.refresh_content_stats()
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH base AS (
    SELECT p.id, p.post_type, p.slug, p.path, p.seo_title, p.seo_description,
           p.featured_media_id, length(coalesce(p.content, '')) AS content_len
    FROM wp_posts p
    WHERE p.status = 'publish'
  ),
  totals AS (
    SELECT jsonb_object_agg(post_type, n) AS by_type, sum(n) AS all_items
    FROM (SELECT post_type, count(*) AS n FROM base GROUP BY post_type) t
  ),
  quality AS (
    SELECT jsonb_build_object(
      'missing_seo_title', count(*) FILTER (WHERE coalesce(seo_title, '') = ''),
      'missing_seo_description', count(*) FILTER (WHERE coalesce(seo_description, '') = ''),
      'thin_content', count(*) FILTER (WHERE content_len < 2000),
      'no_featured_media', count(*) FILTER (WHERE coalesce(featured_media_id, 0) = 0),
      'avg_content_len', round(avg(content_len))
    ) AS q
    FROM base
  ),
  outlines AS (
    SELECT count(*) AS n FROM wp_post_outlines o JOIN base b ON b.slug = o.slug
  ),
  uncategorised AS (
    SELECT count(*) AS n
    FROM base b
    WHERE b.post_type = 'post'
      AND NOT EXISTS (SELECT 1 FROM wp_post_terms pt WHERE pt.post_id = b.id AND pt.taxonomy = 'category')
  ),
  clusters AS (
    SELECT jsonb_agg(c ORDER BY posts DESC) AS list
    FROM (
      SELECT count(b.id) AS posts, jsonb_build_object(
        'slug', t.slug,
        'name', t.name,
        'parent_id', t.parent_id,
        'posts', count(b.id),
        'avg_len', coalesce(round(avg(b.content_len)), 0),
        'with_outline', count(o.slug),
        'thin', count(b.id) FILTER (WHERE b.content_len < 2000)
      ) AS c
      FROM wp_terms t
      LEFT JOIN wp_post_terms pt ON pt.term_id = t.id AND pt.taxonomy = 'category'
      LEFT JOIN base b ON b.id = pt.post_id
      LEFT JOIN wp_post_outlines o ON o.slug = b.slug
      WHERE t.taxonomy = 'category'
      GROUP BY t.slug, t.name, t.parent_id
    ) s
  ),
  sections AS (
    SELECT jsonb_agg(jsonb_build_object('section', section, 'items', items) ORDER BY items DESC) AS list
    FROM (
      SELECT split_part(trim(both '/' from coalesce(path, '')), '/', 1) AS section, count(*) AS items
      FROM base
      WHERE coalesce(path, '') <> ''
      GROUP BY 1
      ORDER BY count(*) DESC
      LIMIT 40
    ) s2
  )
  SELECT jsonb_build_object(
    'totals', (SELECT by_type FROM totals),
    'total_published', (SELECT all_items FROM totals),
    'media', (SELECT count(*) FROM wp_media),
    'categories', (SELECT count(*) FROM wp_terms WHERE taxonomy = 'category'),
    'outlines', (SELECT n FROM outlines),
    'uncategorised_posts', (SELECT n FROM uncategorised),
    'quality', (SELECT q FROM quality),
    'clusters', (SELECT list FROM clusters),
    'sections', (SELECT list FROM sections)
  ) INTO result;

  INSERT INTO content_stats_snapshot (id, payload, generated_at)
  VALUES (1, result, now())
  ON CONFLICT (id) DO UPDATE SET payload = excluded.payload, generated_at = excluded.generated_at;

  RETURN result;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.refresh_content_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.refresh_content_stats() TO service_role, sandbox_exec;