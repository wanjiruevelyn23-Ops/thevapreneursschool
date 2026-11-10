ALTER TABLE public.module_content
  ADD COLUMN IF NOT EXISTS video_url text;

DROP POLICY IF EXISTS "module_content_read_published" ON public.module_content;
CREATE POLICY "module_content_read_published" ON public.module_content
  FOR SELECT TO authenticated
  USING (published = true AND public.has_active_enrollment(auth.uid(), course_slug));

CREATE OR REPLACE FUNCTION public.student_modules_with_video()
RETURNS TABLE(
  course_slug text,
  module_slug text,
  title text,
  summary text,
  duration text,
  lesson jsonb,
  notes jsonb,
  quiz jsonb,
  assignment jsonb,
  resources jsonb,
  video_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT m.course_slug, m.module_slug, m.title, m.summary, m.duration, m.lesson, m.notes,
    COALESCE((SELECT jsonb_agg(q - 'answerIndex' - 'explanation') FROM jsonb_array_elements(m.quiz) q), '[]'::jsonb),
    m.assignment, m.resources, m.video_url
  FROM public.module_content m
  WHERE m.published AND public.has_active_enrollment(auth.uid(), m.course_slug)
$function$;

GRANT EXECUTE ON FUNCTION public.student_modules_with_video() TO authenticated;