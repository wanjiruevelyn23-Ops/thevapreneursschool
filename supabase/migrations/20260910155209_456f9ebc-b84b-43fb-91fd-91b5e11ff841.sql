ALTER TABLE public.module_content
  ADD COLUMN IF NOT EXISTS resources jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE POLICY "module_files_read_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'module-files');

CREATE POLICY "module_files_admin_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'module-files' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "module_files_admin_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'module-files' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'module-files' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "module_files_admin_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'module-files' AND public.has_role(auth.uid(), 'admin'::app_role));