ALTER TABLE public.module_content
  ADD COLUMN IF NOT EXISTS release_at timestamptz,
  ADD COLUMN IF NOT EXISTS slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS quiz_feedback text NOT NULL DEFAULT 'full';

ALTER TABLE public.module_content DROP CONSTRAINT IF EXISTS module_content_quiz_feedback_check;
ALTER TABLE public.module_content ADD CONSTRAINT module_content_quiz_feedback_check
  CHECK (quiz_feedback IN ('full','score','none'));

-- A module is open to an enrolled student when its content is published and released.
-- Release-gated courses (the Accelerator) have no built-in content, so a missing row means "not released".
CREATE OR REPLACE FUNCTION public.module_available(_course_slug text, _module_slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.module_content m
    WHERE m.course_slug = _course_slug AND m.module_slug = _module_slug
      AND m.published AND (m.release_at IS NULL OR m.release_at <= now())
  ) OR (
    _course_slug <> 'accelerator' AND NOT EXISTS (
      SELECT 1 FROM public.module_content m
      WHERE m.course_slug = _course_slug AND m.module_slug = _module_slug)
  )
$$;

DROP POLICY IF EXISTS module_content_read_published ON public.module_content;
CREATE POLICY module_content_read_published ON public.module_content FOR SELECT TO authenticated
  USING (published = true AND (release_at IS NULL OR release_at <= now())
    AND public.has_active_enrollment(auth.uid(), course_slug));

CREATE OR REPLACE FUNCTION public.student_modules_v2()
RETURNS TABLE(course_slug text, module_slug text, title text, summary text, duration text, lesson jsonb,
  notes jsonb, quiz jsonb, assignment jsonb, resources jsonb, video_url text, slides jsonb,
  release_at timestamptz, quiz_feedback text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT m.course_slug, m.module_slug, m.title, m.summary, m.duration, m.lesson, m.notes,
    COALESCE((SELECT jsonb_agg(q - 'answerIndex' - 'explanation') FROM jsonb_array_elements(m.quiz) q), '[]'::jsonb),
    m.assignment, m.resources, m.video_url, m.slides, m.release_at, m.quiz_feedback
  FROM public.module_content m
  WHERE m.published AND (m.release_at IS NULL OR m.release_at <= now())
    AND public.has_active_enrollment(auth.uid(), m.course_slug)
$$;

-- Titles and dates of published-but-upcoming lessons, so students see what's coming (no content).
CREATE OR REPLACE FUNCTION public.student_schedule()
RETURNS TABLE(course_slug text, module_slug text, title text, release_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT m.course_slug, m.module_slug, m.title, m.release_at
  FROM public.module_content m
  WHERE m.published AND m.release_at IS NOT NULL AND m.release_at > now()
    AND public.has_active_enrollment(auth.uid(), m.course_slug)
$$;

CREATE OR REPLACE FUNCTION public.submit_module(_course_slug text, _module_slug text, _answers jsonb, _force boolean DEFAULT false)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  _quiz jsonb; _fb text; _score int := 0; _total int := 0; _q jsonb; _m int; _complete boolean; _key jsonb := '{}'::jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_active_enrollment(auth.uid(), _course_slug) THEN
    RAISE EXCEPTION 'You do not have access to this course';
  END IF;
  IF NOT public.module_available(_course_slug, _module_slug) THEN
    RAISE EXCEPTION 'This lesson is not open yet';
  END IF;
  SELECT quiz, quiz_feedback INTO _quiz, _fb FROM public.module_content
    WHERE course_slug = _course_slug AND module_slug = _module_slug AND published;
  _quiz := COALESCE(_quiz, '[]'::jsonb); _fb := COALESCE(_fb, 'full');
  FOR _q IN SELECT * FROM jsonb_array_elements(_quiz) LOOP
    _m := CASE WHEN (_q->>'marks') ~ '^[0-9]+$' AND (_q->>'marks')::int > 0 THEN (_q->>'marks')::int ELSE 1 END;
    _total := _total + _m;
    _key := _key || jsonb_build_object(_q->>'id', jsonb_build_object('answerIndex', _q->'answerIndex', 'explanation', _q->'explanation'));
    IF (_answers->>(_q->>'id')) ~ '^[0-9]+$' AND (_answers->>(_q->>'id'))::int = (_q->>'answerIndex')::int THEN
      _score := _score + _m;
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
  RETURN jsonb_build_object(
    'score', CASE WHEN _fb = 'none' THEN NULL ELSE _score END,
    'total', CASE WHEN _fb = 'none' THEN NULL ELSE _total END,
    'completed', _complete, 'feedback', _fb,
    'key', CASE WHEN _fb = 'full' THEN _key ELSE '{}'::jsonb END);
END; $function$;

CREATE OR REPLACE FUNCTION public.touch_module(_course_slug text, _module_slug text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_active_enrollment(auth.uid(), _course_slug)
    OR NOT public.module_available(_course_slug, _module_slug) THEN RETURN; END IF;
  INSERT INTO public.module_progress (user_id, course_slug, module_slug, last_accessed)
  VALUES (auth.uid(), _course_slug, _module_slug, now())
  ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET last_accessed = now();
END; $function$;

DROP POLICY IF EXISTS submissions_student_insert ON public.assignment_submissions;
CREATE POLICY submissions_student_insert ON public.assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_active_enrollment(auth.uid(), course_slug)
    AND public.module_available(course_slug, module_slug));

DROP POLICY IF EXISTS submission_files_insert ON storage.objects;
CREATE POLICY submission_files_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'submissions' AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.has_active_enrollment(auth.uid(), (storage.foldername(name))[2])
    AND public.module_available((storage.foldername(name))[2], (storage.foldername(name))[3]));

DROP POLICY IF EXISTS module_files_read_enrolled ON storage.objects;
CREATE POLICY module_files_read_enrolled ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'module-files' AND (
    public.is_course_staff(auth.uid(), (storage.foldername(name))[1])
    OR (public.has_active_enrollment(auth.uid(), (storage.foldername(name))[1])
      AND public.module_available((storage.foldername(name))[1], (storage.foldername(name))[2]))));

REVOKE EXECUTE ON FUNCTION public.module_available(text, text), public.student_modules_v2(), public.student_schedule() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.module_available(text, text), public.student_modules_v2(), public.student_schedule() TO authenticated;