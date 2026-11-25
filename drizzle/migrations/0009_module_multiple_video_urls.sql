ALTER TABLE public.module_content
  ADD COLUMN IF NOT EXISTS video_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'module_content_video_urls_is_array'
  ) THEN
    ALTER TABLE public.module_content
      ADD CONSTRAINT module_content_video_urls_is_array
      CHECK (jsonb_typeof(video_urls) = 'array');
  END IF;
END $$;

UPDATE public.module_content
SET video_urls = jsonb_build_array(btrim(video_url))
WHERE video_url IS NOT NULL
  AND btrim(video_url) <> ''
  AND video_urls = '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.student_modules_v3()
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
  video_url text,
  video_urls jsonb,
  slides jsonb,
  release_at timestamptz,
  quiz_feedback text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT
    m.course_slug,
    m.module_slug,
    m.title,
    m.summary,
    m.duration,
    m.lesson,
    m.notes,
    COALESCE((SELECT jsonb_agg(q - 'answerIndex' - 'explanation') FROM jsonb_array_elements(m.quiz) q), '[]'::jsonb),
    m.assignment,
    m.resources,
    m.video_url,
    m.video_urls,
    m.slides,
    m.release_at,
    m.quiz_feedback
  FROM public.module_content m
  WHERE public.module_available(m.course_slug, m.module_slug)
    AND public.has_active_enrollment(auth.uid(), m.course_slug)
$$;

REVOKE EXECUTE ON FUNCTION public.student_modules_v3() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.student_modules_v3() TO authenticated;