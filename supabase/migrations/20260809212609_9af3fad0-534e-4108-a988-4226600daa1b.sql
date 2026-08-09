CREATE TABLE public.wp_post_outlines (
  slug text PRIMARY KEY,
  title text,
  source_url text,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  quotes jsonb NOT NULL DEFAULT '[]'::jsonb,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  risks jsonb NOT NULL DEFAULT '[]'::jsonb,
  tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  citations jsonb NOT NULL DEFAULT '[]'::jsonb,
  takeaways jsonb NOT NULL DEFAULT '[]'::jsonb,
  best_practices jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  narrative jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wp_post_outlines TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wp_post_outlines TO authenticated;
GRANT ALL ON public.wp_post_outlines TO service_role;
ALTER TABLE public.wp_post_outlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read outlines" ON public.wp_post_outlines FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write outlines" ON public.wp_post_outlines FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER wp_post_outlines_touch BEFORE UPDATE ON public.wp_post_outlines FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.seo_audit_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  target_path text NOT NULL,
  target_kind text,
  detail text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX seo_audit_findings_kind_idx ON public.seo_audit_findings (kind, resolved);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_audit_findings TO authenticated;
GRANT ALL ON public.seo_audit_findings TO service_role;
ALTER TABLE public.seo_audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo findings" ON public.seo_audit_findings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));