ALTER TABLE public.profiles ALTER COLUMN account_status SET DEFAULT 'pending_approval';
UPDATE public.profiles p SET account_status = CASE
  WHEN EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = p.id AND r.role = 'admin') THEN 'approved'
  ELSE 'pending_approval' END;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_account_status_check
  CHECK (account_status IN ('pending_approval','approved','rejected','suspended'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_by uuid;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, account_status)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'), NEW.email, 'pending_approval')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.account_status := 'pending_approval'; NEW.approved_at := NULL; NEW.approved_by := NULL;
    ELSE
      NEW.email := OLD.email; NEW.account_status := OLD.account_status;
      NEW.approved_at := OLD.approved_at; NEW.approved_by := OLD.approved_by;
    END IF;
  ELSIF auth.uid() IS NOT NULL AND TG_OP = 'UPDATE' AND NEW.account_status IS DISTINCT FROM OLD.account_status THEN
    NEW.approved_by := auth.uid();
    IF NEW.account_status = 'approved' THEN NEW.approved_at := now(); END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_profile_fields ON public.profiles;
CREATE TRIGGER protect_profile_fields BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();
REVOKE EXECUTE ON FUNCTION public.protect_profile_fields() FROM anon, authenticated, public;

DROP POLICY IF EXISTS profiles_admin_update ON public.profiles;
CREATE POLICY profiles_admin_update ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.has_active_enrollment(_user_id uuid, _course_slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN auth.users u ON u.id = e.user_id
    JOIN public.profiles p ON p.id = e.user_id
    WHERE e.user_id = _user_id AND e.course_slug = _course_slug
      AND e.access_status = 'active' AND u.email_confirmed_at IS NOT NULL
      AND p.account_status = 'approved'
  )
$$;

CREATE OR REPLACE FUNCTION public.my_access()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'email_verified', (SELECT u.email_confirmed_at IS NOT NULL FROM auth.users u WHERE u.id = auth.uid()),
    'account_status', (SELECT p.account_status FROM public.profiles p WHERE p.id = auth.uid()),
    'roles', COALESCE((SELECT jsonb_agg(r.role) FROM public.user_roles r WHERE r.user_id = auth.uid()), '[]'::jsonb)
  )
$$;

CREATE OR REPLACE FUNCTION public.admin_users()
RETURNS TABLE (id uuid, email text, full_name text, created_at timestamptz, email_verified boolean,
  account_status text, provider text, roles jsonb, last_sign_in_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  RETURN QUERY
  SELECT u.id, u.email::text, p.full_name, u.created_at, u.email_confirmed_at IS NOT NULL,
    COALESCE(p.account_status, 'pending_approval'), COALESCE(u.raw_app_meta_data->>'provider','email'),
    COALESCE((SELECT jsonb_agg(r.role) FROM public.user_roles r WHERE r.user_id = u.id), '[]'::jsonb),
    u.last_sign_in_at
  FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC;
END; $$;

CREATE TABLE IF NOT EXISTS public.course_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug)
);
GRANT SELECT, INSERT, DELETE ON public.course_instructors TO authenticated;
GRANT ALL ON public.course_instructors TO service_role;
ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;
CREATE POLICY course_instructors_read ON public.course_instructors FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY course_instructors_admin_insert ON public.course_instructors FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY course_instructors_admin_delete ON public.course_instructors FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.is_course_staff(_user_id uuid, _course_slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.has_role(_user_id, 'admin') OR (
    public.has_role(_user_id, 'instructor') AND EXISTS (
      SELECT 1 FROM public.course_instructors ci WHERE ci.user_id = _user_id AND ci.course_slug = _course_slug))
$$;

DROP POLICY IF EXISTS module_content_staff_read ON public.module_content;
DROP POLICY IF EXISTS module_content_staff_insert ON public.module_content;
DROP POLICY IF EXISTS module_content_staff_update ON public.module_content;
DROP POLICY IF EXISTS module_content_staff_delete ON public.module_content;
CREATE POLICY module_content_staff_read ON public.module_content FOR SELECT TO authenticated
  USING (public.is_course_staff(auth.uid(), course_slug));
CREATE POLICY module_content_staff_insert ON public.module_content FOR INSERT TO authenticated
  WITH CHECK (public.is_course_staff(auth.uid(), course_slug));
CREATE POLICY module_content_staff_update ON public.module_content FOR UPDATE TO authenticated
  USING (public.is_course_staff(auth.uid(), course_slug)) WITH CHECK (public.is_course_staff(auth.uid(), course_slug));
CREATE POLICY module_content_staff_delete ON public.module_content FOR DELETE TO authenticated
  USING (public.is_course_staff(auth.uid(), course_slug));

DROP POLICY IF EXISTS module_files_admin_insert ON storage.objects;
DROP POLICY IF EXISTS module_files_admin_update ON storage.objects;
DROP POLICY IF EXISTS module_files_admin_delete ON storage.objects;
DROP POLICY IF EXISTS module_files_read_enrolled ON storage.objects;
CREATE POLICY module_files_read_enrolled ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'module-files' AND (
    public.is_course_staff(auth.uid(), (storage.foldername(name))[1])
    OR public.has_active_enrollment(auth.uid(), (storage.foldername(name))[1])));
CREATE POLICY module_files_staff_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'module-files' AND public.is_course_staff(auth.uid(), (storage.foldername(name))[1]));
CREATE POLICY module_files_staff_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'module-files' AND public.is_course_staff(auth.uid(), (storage.foldername(name))[1]));
CREATE POLICY module_files_staff_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'module-files' AND public.is_course_staff(auth.uid(), (storage.foldername(name))[1]));

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  module_slug text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NOT NULL,
  total integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quiz_attempts_user_idx ON public.quiz_attempts (user_id, course_slug, module_slug);
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY quiz_attempts_read ON public.quiz_attempts FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_course_staff(auth.uid(), course_slug));

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
    IF (_answers->>(_q->>'id')) ~ '^[0-9]+$' AND (_answers->>(_q->>'id'))::int = (_q->>'answerIndex')::int THEN
      _score := _score + 1;
    END IF;
  END LOOP;
  _complete := _total = 0 OR _score = _total OR _force;
  IF _total > 0 AND NOT _force THEN
    INSERT INTO public.quiz_attempts (user_id, course_slug, module_slug, answers, score, total)
    VALUES (auth.uid(), _course_slug, _module_slug, COALESCE(_answers, '{}'::jsonb), _score, _total);
  END IF;
  INSERT INTO public.module_progress (user_id, course_slug, module_slug, completed, score, total, updated_at, last_accessed, completed_at)
  VALUES (auth.uid(), _course_slug, _module_slug, _complete,
    CASE WHEN _total > 0 THEN _score END, CASE WHEN _total > 0 THEN _total END, now(), now(), CASE WHEN _complete THEN now() END)
  ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET
    completed = module_progress.completed OR EXCLUDED.completed,
    score = GREATEST(COALESCE(EXCLUDED.score, 0), COALESCE(module_progress.score, 0)),
    total = COALESCE(EXCLUDED.total, module_progress.total),
    updated_at = now(), last_accessed = now(),
    completed_at = COALESCE(module_progress.completed_at, EXCLUDED.completed_at);
  RETURN jsonb_build_object('score', _score, 'total', _total, 'completed', _complete, 'key', _key);
END; $$;

CREATE OR REPLACE FUNCTION public.touch_module(_course_slug text, _module_slug text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_active_enrollment(auth.uid(), _course_slug) THEN RETURN; END IF;
  INSERT INTO public.module_progress (user_id, course_slug, module_slug, last_accessed)
  VALUES (auth.uid(), _course_slug, _module_slug, now())
  ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET last_accessed = now();
END; $$;

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  module_slug text NOT NULL,
  response text,
  file_path text,
  file_name text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','reviewed')),
  grade text,
  feedback text,
  feedback_released boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);
CREATE INDEX IF NOT EXISTS assignment_submissions_idx ON public.assignment_submissions (course_slug, module_slug, user_id);
GRANT SELECT, INSERT, UPDATE ON public.assignment_submissions TO authenticated;
GRANT ALL ON public.assignment_submissions TO service_role;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY submissions_read ON public.assignment_submissions FOR SELECT TO authenticated
  USING (public.is_course_staff(auth.uid(), course_slug));
CREATE POLICY submissions_student_insert ON public.assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_active_enrollment(auth.uid(), course_slug));
CREATE POLICY submissions_staff_update ON public.assignment_submissions FOR UPDATE TO authenticated
  USING (public.is_course_staff(auth.uid(), course_slug)) WITH CHECK (public.is_course_staff(auth.uid(), course_slug));

CREATE OR REPLACE FUNCTION public.guard_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'submitted'; NEW.grade := NULL; NEW.feedback := NULL;
    NEW.feedback_released := false; NEW.reviewed_at := NULL; NEW.reviewed_by := NULL;
    NEW.submitted_at := now();
  ELSE
    NEW.user_id := OLD.user_id; NEW.course_slug := OLD.course_slug; NEW.module_slug := OLD.module_slug;
    NEW.response := OLD.response; NEW.file_path := OLD.file_path; NEW.file_name := OLD.file_name;
    NEW.submitted_at := OLD.submitted_at;
    NEW.reviewed_by := auth.uid(); NEW.reviewed_at := now(); NEW.status := 'reviewed';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS guard_submission ON public.assignment_submissions;
CREATE TRIGGER guard_submission BEFORE INSERT OR UPDATE ON public.assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.guard_submission();

CREATE OR REPLACE FUNCTION public.my_submissions()
RETURNS TABLE (id uuid, course_slug text, module_slug text, response text, file_name text, status text,
  grade text, feedback text, submitted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT s.id, s.course_slug, s.module_slug, s.response, s.file_name, s.status,
    CASE WHEN s.feedback_released THEN s.grade END, CASE WHEN s.feedback_released THEN s.feedback END, s.submitted_at
  FROM public.assignment_submissions s WHERE s.user_id = auth.uid() ORDER BY s.submitted_at DESC
$$;

CREATE POLICY submission_files_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.has_active_enrollment(auth.uid(), (storage.foldername(name))[2]));
CREATE POLICY submission_files_read ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND ((storage.foldername(name))[1] = auth.uid()::text
    OR public.is_course_staff(auth.uid(), (storage.foldername(name))[2])));

REVOKE EXECUTE ON FUNCTION public.my_access(), public.admin_users(), public.is_course_staff(uuid, text),
  public.touch_module(text, text), public.my_submissions(), public.guard_submission(),
  public.submit_module(text, text, jsonb, boolean), public.has_active_enrollment(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.my_access(), public.admin_users(), public.is_course_staff(uuid, text),
  public.touch_module(text, text), public.my_submissions(),
  public.submit_module(text, text, jsonb, boolean), public.has_active_enrollment(uuid, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_submission() FROM authenticated;