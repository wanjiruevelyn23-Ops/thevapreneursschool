DROP POLICY IF EXISTS applications_public_insert ON public.applications;
CREATE POLICY applications_public_insert ON public.applications FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND (experience IS NULL OR char_length(experience) <= 2000)
  AND (message IS NULL OR char_length(message) <= 5000)
  AND (course_slug IS NULL OR char_length(course_slug) <= 200)
  AND (course_title IS NULL OR char_length(course_title) <= 300)
  AND (track IS NULL OR char_length(track) <= 100)
);
DROP POLICY IF EXISTS contact_public_insert ON public.contact_messages;
CREATE POLICY contact_public_insert ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(btrim(topic)) BETWEEN 1 AND 200
  AND char_length(btrim(message)) BETWEEN 1 AND 5000
);