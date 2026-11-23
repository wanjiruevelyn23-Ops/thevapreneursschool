CREATE OR REPLACE FUNCTION public.lesson_requirements(_user_id uuid, _course_slug text, _module_slug text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT jsonb_build_object(
    'quiz_done', COALESCE(jsonb_array_length(mc.quiz), 0) = 0 OR EXISTS (
      SELECT 1 FROM quiz_attempts qa WHERE qa.user_id = _user_id AND qa.course_slug = _course_slug AND qa.module_slug = _module_slug),
    'assignment_done', mc.assignment IS NULL OR mc.assignment = 'null'::jsonb OR EXISTS (
      SELECT 1 FROM assignment_submissions s WHERE s.user_id = _user_id AND s.course_slug = _course_slug AND s.module_slug = _module_slug))
  FROM (SELECT 1) x LEFT JOIN module_content mc ON mc.course_slug = _course_slug AND mc.module_slug = _module_slug AND mc.published
$$;
REVOKE EXECUTE ON FUNCTION public.lesson_requirements(uuid, text, text) FROM anon, public;

CREATE OR REPLACE FUNCTION public.submit_module(_course_slug text, _module_slug text, _answers jsonb, _force boolean DEFAULT false)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  _quiz jsonb; _fb text; _score int := 0; _total int := 0; _q jsonb; _m int; _complete boolean; _key jsonb := '{}'::jsonb;
  _req jsonb; _attempts int;
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
  IF _total > 0 THEN
    INSERT INTO public.quiz_attempts (user_id, course_slug, module_slug, answers, score, total)
    VALUES (auth.uid(), _course_slug, _module_slug, COALESCE(_answers, '{}'::jsonb), _score, _total);
  END IF;
  _req := public.lesson_requirements(auth.uid(), _course_slug, _module_slug);
  _complete := (_req->>'quiz_done')::boolean AND (_req->>'assignment_done')::boolean;
  SELECT count(*) INTO _attempts FROM public.quiz_attempts
    WHERE user_id = auth.uid() AND course_slug = _course_slug AND module_slug = _module_slug;
  INSERT INTO public.module_progress (user_id, course_slug, module_slug, completed, score, total, updated_at, last_accessed, completed_at)
  VALUES (auth.uid(), _course_slug, _module_slug, _complete,
    CASE WHEN _total > 0 THEN _score END, CASE WHEN _total > 0 THEN _total END, now(), now(), CASE WHEN _complete THEN now() END)
  ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET
    completed = module_progress.completed OR EXCLUDED.completed,
    score = COALESCE(EXCLUDED.score, module_progress.score),
    total = COALESCE(EXCLUDED.total, module_progress.total),
    updated_at = now(), last_accessed = now(),
    completed_at = COALESCE(module_progress.completed_at, EXCLUDED.completed_at);
  RETURN jsonb_build_object(
    'score', CASE WHEN _fb = 'none' THEN NULL ELSE _score END,
    'total', CASE WHEN _fb = 'none' THEN NULL ELSE _total END,
    'completed', _complete, 'feedback', _fb, 'attempt', _attempts,
    'needs_assignment', NOT (_req->>'assignment_done')::boolean,
    'key', CASE WHEN _fb = 'full' THEN _key ELSE '{}'::jsonb END);
END; $function$;

CREATE OR REPLACE FUNCTION public.complete_after_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _req jsonb;
BEGIN
  _req := public.lesson_requirements(NEW.user_id, NEW.course_slug, NEW.module_slug);
  IF (_req->>'quiz_done')::boolean AND (_req->>'assignment_done')::boolean THEN
    INSERT INTO public.module_progress (user_id, course_slug, module_slug, completed, updated_at, last_accessed, completed_at)
    VALUES (NEW.user_id, NEW.course_slug, NEW.module_slug, true, now(), now(), now())
    ON CONFLICT (user_id, course_slug, module_slug) DO UPDATE SET
      completed = true, updated_at = now(),
      completed_at = COALESCE(module_progress.completed_at, now());
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS complete_after_submission ON public.assignment_submissions;
CREATE TRIGGER complete_after_submission AFTER INSERT ON public.assignment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.complete_after_submission();