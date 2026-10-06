# Student portal access rebuild

## Audit findings (current holes)
1. Students can enrol themselves: the enrollments table lets any signed-in user insert/update their own rows, so signing up and clicking "Enrol" grants access.
2. Email confirmation is switched off (auto-confirm was enabled earlier), so unverified accounts get in.
3. Built-in lesson notes, quizzes and assignments ship inside the website code itself, so anyone can read them from the browser without an account.
4. Instructor-published module content is readable by every signed-in user, enrolled or not.
5. Portal gating is done only in the page, not by a protected route.

## New access flow
```text
Browse site -> Apply (application stored, status: pending)
 -> Create account + verify email
 -> Admin approves in /admin/submissions  (enrollment: approved, payment: unpaid/paid)
 -> Admin marks paid / activates           (access: active)
 -> Portal shows ONLY active courses' content
```
Portal states: signed out (redirect to sign-in), unverified (verify-email screen with resend), signed in with no active enrollment ("You don't have an active course enrollment yet" + links to Courses/Apply), pending/approved-awaiting-payment (status card), active (full course), suspended/cancelled (blocked notice).

## Database changes
- profiles: add email, phone, account_status, updated_at.
- enrollments: add enrollment_status (pending, approved, active, suspended, completed, cancelled), payment_status (unpaid, paid, waived), access_status, enrolled_at, completed_at, updated_at, application_id link. Remove the student "write own" policy; students may only read their own rows. Only admins insert/update.
- module_progress: add last_accessed, completed_at. Insert/update allowed only when the student has an active enrollment for that course (checked in the database).
- module_content: students can read a module only if published AND they hold an active enrollment for that course.
- Module files storage: same active-enrollment check for downloads.
- A secure database helper `has_active_enrollment(user, course)` used by all of the above.
- Existing enrollments are migrated as "pending" (not active) so nobody keeps unearned access; you can activate real students from the admin page.

## Course content protection
- Move the built-in lesson notes, quizzes and assignments for all modules out of the website code into the database (module_content rows, published). The public site keeps only titles, summaries and syllabi.
- Quiz answers are graded on the server so correct answers are never sent to the browser before submission.

## Auth
- Turn email confirmation back on (mandatory verification).
- Forgot password + /reset-password page.
- "Remember me" on sign in (unticked = session cleared when the browser closes).
- Google sign-in.
- Proper sign-out (clears cached data, no back-button return).
- /portal moved under a protected route; unverified users see the verify screen.

## Admin
- /admin/submissions gains an Enrollments tab: approve application -> create enrollment, set payment status, activate, suspend, cancel, complete. Matches applicants to accounts by email.

## Not included now
- Automatic M-Pesa checkout (needs a payment provider account such as IntaSend or Pesapal). Payment status is set manually by you until then.

## Technical details
- Migration: new columns, enum-free text checks, `has_active_enrollment` SECURITY DEFINER, rewritten RLS on enrollments/module_progress/module_content/storage.objects; data seed of built-in module content via INSERT.
- Routes: src/routes/_authenticated/route.tsx gate, portal moved to _authenticated/portal.tsx, new reset-password.tsx.
- Server functions with requireSupabaseAuth for quiz grading and admin enrollment actions (admin role verified via has_role).
- Strip lesson/quiz/notes bodies from src/content; portal reads content via RLS-protected queries.
- Run security linter after migration.
