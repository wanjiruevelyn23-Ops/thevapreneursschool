-- PROFILES
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE u.id = p.id AND p.email IS NULL;
INSERT INTO public.profiles (id, full_name, email)
  SELECT u.id, u.raw_user_meta_data->>'full_name', u.email FROM auth.users u
  ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END; $$;

-- Students may only edit name/phone on their own profile.
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') AND auth.uid() IS NOT NULL THEN
    NEW.email := OLD.email;
    NEW.account_status := OLD.account_status;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_profile_fields ON public.profiles;
CREATE TRIGGER protect_profile_fields BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

DROP POLICY IF EXISTS profiles_admin_select ON public.profiles;
CREATE POLICY profiles_admin_select ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ENROLLMENTS
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS enrollment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS access_status text NOT NULL DEFAULT 'locked',
  ADD COLUMN IF NOT EXISTS enrolled_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL;

ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_status_check CHECK (
  enrollment_status IN ('pending','approved','active','suspended','completed','cancelled')
  AND payment_status IN ('unpaid','paid','waived')
  AND access_status IN ('locked','active'));

CREATE OR REPLACE FUNCTION public.sync_enrollment_access()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.access_status := CASE WHEN NEW.enrollment_status IN ('active','completed') THEN 'active' ELSE 'locked' END;
  IF NEW.enrollment_status = 'active' AND NEW.enrolled_at IS NULL THEN NEW.enrolled_at := now(); END IF;
  IF NEW.enrollment_status = 'completed' AND NEW.completed_at IS NULL THEN NEW.completed_at := now(); END IF;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS sync_enrollment_access ON public.enrollments;
CREATE TRIGGER sync_enrollment_access BEFORE INSERT OR UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.sync_enrollment_access();

-- Existing self-made enrollments lose access until approved.
UPDATE public.enrollments SET enrollment_status = 'pending' WHERE enrollment_status = 'pending';

DROP POLICY IF EXISTS enrollments_own_all ON public.enrollments;
CREATE POLICY enrollments_own_select ON public.enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY enrollments_admin_insert ON public.enrollments FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY enrollments_admin_update ON public.enrollments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY enrollments_admin_delete ON public.enrollments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ACCESS HELPER (requires verified email + active enrollment)
CREATE OR REPLACE FUNCTION public.has_active_enrollment(_user_id uuid, _course_slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN auth.users u ON u.id = e.user_id
    WHERE e.user_id = _user_id AND e.course_slug = _course_slug
      AND e.access_status = 'active' AND u.email_confirmed_at IS NOT NULL
  )
$$;

-- MODULE PROGRESS: students read/reset own; writes only through submit_module().
ALTER TABLE public.module_progress
  ADD COLUMN IF NOT EXISTS last_accessed timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;
DROP POLICY IF EXISTS module_progress_own_all ON public.module_progress;
CREATE POLICY module_progress_own_select ON public.module_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY module_progress_own_delete ON public.module_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- MODULE CONTENT: students no longer read the table directly (it holds quiz answers).
DROP POLICY IF EXISTS module_content_read_published ON public.module_content;

CREATE OR REPLACE FUNCTION public.student_modules()
RETURNS TABLE (course_slug text, module_slug text, title text, summary text, duration text,
  lesson jsonb, notes jsonb, quiz jsonb, assignment jsonb, resources jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT m.course_slug, m.module_slug, m.title, m.summary, m.duration, m.lesson, m.notes,
    COALESCE((SELECT jsonb_agg(q - 'answerIndex' - 'explanation') FROM jsonb_array_elements(m.quiz) q), '[]'::jsonb),
    m.assignment, m.resources
  FROM public.module_content m
  WHERE m.published AND public.has_active_enrollment(auth.uid(), m.course_slug)
$$;

CREATE OR REPLACE FUNCTION public.submit_module(_course_slug text, _module_slug text, _answers jsonb, _force boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _quiz jsonb; _score int := 0; _total int := 0; _q jsonb; _complete boolean; _key jsonb := '{}'::jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_active_enrollment(auth.uid(), _course_slug) THEN
    RAISE EXCEPTION 'You do not have access to this course';
  END IF;
  SELECT quiz INTO _quiz FROM public.module_content
    WHERE course_slug = _course_slug AND module_slug = _module_slug AND published;
  _quiz := COALESCE(_quiz, '[]'::jsonb);
  FOR _q IN SELECT * FROM jsonb_array_elements(_quiz) LOOP
    _total := _total + 1;
    _key := _key || jsonb_build_object(_q->>'id', jsonb_build_object('answerIndex', _q->'answerIndex', 'explanation', _q->'explanation'));
    IF (_answers->>(_q->>'id')) IS NOT NULL AND (_answers->>(_q->>'id'))::int = (_q->>'answerIndex')::int THEN
      _score := _score + 1;
    END IF;
  END LOOP;
  _complete := _total = 0 OR _score = _total OR _force;
  INSERT INTO public.module_progress (user_id, course_slug, module_slug, completed, score, total, updated_at, last_accessed, completed_at)
  VALUES (auth.uid(), _course_slug, _module_slug, _complete,
    CASE WHEN _total > 0 THEN _score END, CASE WHEN _total > 0 THEN _total END, now(), now(), CASE WHEN _complete THEN now() END)
  ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET
    completed = module_progress.completed OR EXCLUDED.completed,
    score = COALESCE(EXCLUDED.score, module_progress.score),
    total = COALESCE(EXCLUDED.total, module_progress.total),
    updated_at = now(), last_accessed = now(),
    completed_at = COALESCE(module_progress.completed_at, EXCLUDED.completed_at);
  RETURN jsonb_build_object('score', _score, 'total', _total, 'completed', _complete, 'key', _key);
END; $$;

REVOKE EXECUTE ON FUNCTION public.student_modules() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.submit_module(text, text, jsonb, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_active_enrollment(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.student_modules() TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_module(text, text, jsonb, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_enrollment(uuid, text) TO authenticated;

-- STORAGE: module files only for enrolled students (path = course/module/file)
DROP POLICY IF EXISTS module_files_read_authenticated ON storage.objects;
CREATE POLICY module_files_read_enrolled ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'module-files' AND (
    public.has_role(auth.uid(), 'admin')
    OR public.has_active_enrollment(auth.uid(), (storage.foldername(name))[1])));