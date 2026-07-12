
CREATE POLICY "Public read wp-media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'wp-media');
CREATE POLICY "Admins write wp-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'wp-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update wp-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'wp-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete wp-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'wp-media' AND public.has_role(auth.uid(), 'admin'));
