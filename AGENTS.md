<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- robots.txt and sitemap.xml are server routes that build URLs from the request host — the site is served on more than one domain, and each must point at itself.
- Accelerator learning modules live in a private LMS-only course catalog entry, use `module_content`, and are exposed to students only through active-enrollment-filtered reads; lesson video embeds must be provider-allowlisted.
- Lesson availability (published + release_at passed) is decided in the database by `module_available`; every student read/write path (content RPCs, quiz, progress, hand-ins, files) must check it — why: upcoming lessons must never leak through a side door.
- Student notes and the instructor saved-notes preview share NotesView and LessonBody — keep formatting identical without exposing drafts to student reads.
- Student assignment instructions and downloads share AssignmentView and ModuleDownloads with saved instructor previews — previews never submit work or record student progress.
- Instructor module saves compare the loaded updated_at in the write and reject stale revisions — an older open editor must not erase imported or newer saved content.
- Instructor file operations update only the latest draft's file list and are scoped to the selected module; draft removal does not delete saved storage files — asynchronous uploads and unsaved removals must not erase lesson edits or break saved downloads.
- Stored lesson, quiz and file arrays are authoritative even when empty — intentionally removed content must not reappear from built-in defaults.
- Course completion is recorded by a database trigger on module_progress; completion emails are claimed atomically on course_completions before sending — why: retries must never email a student twice.
