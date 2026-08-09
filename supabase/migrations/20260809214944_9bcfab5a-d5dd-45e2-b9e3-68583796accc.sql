CREATE TABLE IF NOT EXISTS public.seo_audit_snapshot (
  id integer PRIMARY KEY DEFAULT 1,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seo_audit_snapshot TO anon;
GRANT SELECT ON public.seo_audit_snapshot TO authenticated;
GRANT ALL ON public.seo_audit_snapshot TO service_role;

ALTER TABLE public.seo_audit_snapshot ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read seo audit snapshot" ON public.seo_audit_snapshot;
CREATE POLICY "Public read seo audit snapshot"
  ON public.seo_audit_snapshot FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins write seo audit snapshot" ON public.seo_audit_snapshot;
CREATE POLICY "Admins write seo audit snapshot"
  ON public.seo_audit_snapshot FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.seo_audit_findings TO authenticated;
GRANT ALL ON public.seo_audit_findings TO service_role;

CREATE INDEX IF NOT EXISTS seo_audit_findings_kind_idx ON public.seo_audit_findings (kind, resolved);
CREATE INDEX IF NOT EXISTS wp_posts_seo_title_idx ON public.wp_posts (seo_title) WHERE status = 'publish';

ALTER TABLE public.wp_posts
  ADD COLUMN IF NOT EXISTS enriched_at timestamptz,
  ADD COLUMN IF NOT EXISTS enrich_source text;

CREATE OR REPLACE FUNCTION public.run_seo_audit()
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  summary jsonb;
BEGIN
  DELETE FROM seo_audit_findings WHERE resolved = false;

  WITH base AS (
    SELECT id, post_type, path, permalink, slug, seo_title, seo_description,
           featured_media_id, meta, length(coalesce(content, '')) AS content_len
    FROM wp_posts
    WHERE status = 'publish' AND coalesce(path, '') <> ''
  ),
  dup_title AS (
    SELECT lower(btrim(seo_title)) AS t, count(*) AS n
    FROM base WHERE coalesce(seo_title, '') <> ''
    GROUP BY 1 HAVING count(*) > 1
  ),
  dup_desc AS (
    SELECT lower(btrim(seo_description)) AS d, count(*) AS n
    FROM base WHERE coalesce(seo_description, '') <> ''
    GROUP BY 1 HAVING count(*) > 1
  ),
  issues AS (
    SELECT 'missing_seo_title' AS kind, 'high' AS severity, b.path, b.post_type,
           'No SEO title set; search engines fall back to the H1.' AS detail
    FROM base b WHERE coalesce(b.seo_title, '') = ''
    UNION ALL
    SELECT 'missing_seo_description', 'high', b.path, b.post_type,
           'No meta description; Google will invent a snippet.'
    FROM base b WHERE coalesce(b.seo_description, '') = ''
    UNION ALL
    SELECT 'duplicate_title', 'high', b.path, b.post_type,
           'Title duplicated across ' || d.n || ' pages: ' || left(b.seo_title, 120)
    FROM base b JOIN dup_title d ON d.t = lower(btrim(b.seo_title))
    UNION ALL
    SELECT 'duplicate_description', 'medium', b.path, b.post_type,
           'Meta description duplicated across ' || d.n || ' pages.'
    FROM base b JOIN dup_desc d ON d.d = lower(btrim(b.seo_description))
    UNION ALL
    SELECT 'thin_content', 'medium', b.path, b.post_type,
           'Only ' || b.content_len || ' characters of body content.'
    FROM base b WHERE b.content_len < 1200
    UNION ALL
    SELECT 'noindex', 'high', b.path, b.post_type,
           'Marked noindex in the imported metadata.'
    FROM base b
    WHERE coalesce(b.meta->>'robots', '') ILIKE '%noindex%'
       OR coalesce(b.meta->>'noindex', '') IN ('1', 'true')
    UNION ALL
    SELECT 'no_featured_image', 'low', b.path, b.post_type,
           'No featured image; social previews and rich results suffer.'
    FROM base b WHERE coalesce(b.featured_media_id, 0) = 0
    UNION ALL
    SELECT 'canonical_mismatch', 'medium', b.path, b.post_type,
           'Imported permalink does not match the served path: ' || coalesce(b.permalink, '')
    FROM base b
    WHERE coalesce(b.permalink, '') <> ''
      AND btrim(regexp_replace(regexp_replace(b.permalink, '^https?://[^/]+', ''), '/+$', ''), ' ')
          <> btrim(regexp_replace(b.path, '/+$', ''), ' ')
  ),
  capped AS (
    SELECT * FROM (
      SELECT i.*, row_number() OVER (PARTITION BY i.kind ORDER BY i.path) AS rn
      FROM issues i
    ) x WHERE rn <= 1000
  ),
  inserted AS (
    INSERT INTO seo_audit_findings (kind, severity, target_path, target_kind, detail)
    SELECT kind, severity, path, post_type, detail FROM capped
    RETURNING kind
  ),
  counts AS (
    SELECT kind, count(*) AS n FROM issues GROUP BY kind
  )
  SELECT jsonb_build_object(
    'totals', coalesce((SELECT jsonb_object_agg(kind, n) FROM counts), '{}'::jsonb),
    'total_issues', coalesce((SELECT sum(n) FROM counts), 0),
    'audited', (SELECT count(*) FROM base),
    'stored', (SELECT count(*) FROM inserted)
  ) INTO summary;

  INSERT INTO seo_audit_snapshot (id, payload, generated_at)
  VALUES (1, summary, now())
  ON CONFLICT (id) DO UPDATE SET payload = excluded.payload, generated_at = excluded.generated_at;

  RETURN summary;
END;
$$;