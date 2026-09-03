CREATE TABLE public.module_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  module_slug text NOT NULL,
  title text,
  summary text,
  duration text,
  lesson jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes jsonb,
  quiz jsonb NOT NULL DEFAULT '[]'::jsonb,
  assignment jsonb,
  published boolean NOT NULL DEFAULT false,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_slug, module_slug)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_content TO authenticated;
GRANT ALL ON public.module_content TO service_role;

ALTER TABLE public.module_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "module_content_read_published" ON public.module_content
  FOR SELECT TO authenticated USING (published = true);

CREATE POLICY "module_content_staff_read" ON public.module_content
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "module_content_staff_insert" ON public.module_content
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "module_content_staff_update" ON public.module_content
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "module_content_staff_delete" ON public.module_content
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_module_content_updated_at
BEFORE UPDATE ON public.module_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "user_roles_admin_read" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_admin_insert" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_admin_delete" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));