CREATE TABLE public.course_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  email_sent_at timestamptz,
  email_status text,
  UNIQUE (user_id, course_slug)
);
GRANT SELECT ON public.course_completions TO authenticated;
GRANT ALL ON public.course_completions TO service_role;
ALTER TABLE public.course_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY course_completions_read ON public.course_completions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.course_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  most_useful text CHECK (most_useful IS NULL OR char_length(most_useful) <= 3000),
  improve text CHECK (improve IS NULL OR char_length(improve) <= 3000),
  comments text CHECK (comments IS NULL OR char_length(comments) <= 3000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug)
);
GRANT SELECT, INSERT ON public.course_feedback TO authenticated;
GRANT ALL ON public.course_feedback TO service_role;
ALTER TABLE public.course_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY course_feedback_read ON public.course_feedback FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY course_feedback_insert ON public.course_feedback FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.course_completions c WHERE c.user_id = auth.uid() AND c.course_slug = course_feedback.course_slug));

CREATE OR REPLACE FUNCTION public.record_course_completion()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NEW.completed AND NEW.course_slug = 'accelerator' AND (
    SELECT count(DISTINCT module_slug) FROM public.module_progress
    WHERE user_id = NEW.user_id AND course_slug = 'accelerator' AND completed
      AND module_slug IN ('day-1','day-2','day-3','day-4','day-5','day-6','day-7','day-8','day-9','day-10')
  ) = 10 THEN
    INSERT INTO public.course_completions (user_id, course_slug)
    VALUES (NEW.user_id, 'accelerator') ON CONFLICT (user_id, course_slug) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.record_course_completion() FROM anon, authenticated, public;
CREATE TRIGGER record_course_completion AFTER INSERT OR UPDATE OF completed ON public.module_progress
  FOR EACH ROW EXECUTE FUNCTION public.record_course_completion();