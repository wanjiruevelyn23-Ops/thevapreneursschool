# Instructor signups and Accelerator LMS content

## Build
- Make student account registrations easy to find from the instructor workspace, with a direct accounts entry and a refreshable signup list.
- Add The VApreneurs Accelerator's ten pillars to the Instructor Studio as editable modules, preserving existing courses and the public Accelerator page.
- Add a video URL field alongside notes, quizzes, assignments, and existing downloads. Save it with drafts and published module content.
- Show published Accelerator video, notes, quizzes, and assignments in the student portal only through the existing active-enrollment content path. Display a clear empty video placeholder until a link is added.

## Technical details
- Add a nullable video URL field to the existing module-content storage; retain current access policies and database-grading flow.
- Model Accelerator modules separately from the public course catalogue, then share them with the instructor editor and enrolled-student portal.
- Restrict video embeds to supported providers; other valid links remain openable without embedding.
- Validate account visibility and content editing/publication paths, then check the preview build logs.
