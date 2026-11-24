update public.module_content
set resources = '[{"path":"accelerator/day-3/lovable-portfolio-prompt-template.docx","name":"Lovable Portfolio Prompt Template (Word)","size":42081}]'::jsonb
where course_slug = 'accelerator'
  and module_slug = 'day-3'
  and not exists (
    select 1
    from jsonb_array_elements(resources) as r
    where r ->> 'path' = 'accelerator/day-3/lovable-portfolio-prompt-template.docx'
  );