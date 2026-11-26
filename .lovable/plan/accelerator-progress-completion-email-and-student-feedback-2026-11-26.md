# Accelerator progress, completion email and student feedback

## What you can do now
- **Instructor Dashboard → Submissions → Assignments** shows each student's submitted work, quiz-related assignment review, grades and written feedback.
- **Instructor Dashboard → Submissions → Enrolments** shows who has an Accelerator place and whether it is active.
- There is currently **no single instructor screen showing each student's progress through all ten days**. Quiz attempts, lesson completion and assignment submissions are already recorded separately; this plan brings them together.

## 1. Add an instructor Student progress view
- Add a **Student progress** tab to the existing instructor dashboard, with the Accelerator selected by default.
- Show each actively enrolled student's name, email, completed days (for example, 6/10), progress percentage, latest quiz score, assignment status, last lesson access and course-completion date.
- Add student search and filters for **In progress**, **Completed**, **Needs assignment review** and **Not started**.
- Let you open a student to see all ten days in order: Available/Not yet opened, quiz score and attempt count, assignment submitted/reviewed, and day completed.
- Keep this view admin-only. Students must never see another student's grades, submissions, feedback or activity.

## 2. Record Accelerator completion reliably
- Treat the Accelerator as complete only when all ten existing days are marked complete by the current rules: required quiz submitted and required assignment handed in for each day.
- Create one permanent completion record per student and course, with the actual completion date. Retakes or repeated sign-ins must not create duplicate completions.
- Show completed students in the instructor progress view and show the student a completion message in their portal.

## 3. Send a once-only congratulations email
- Automatically detect newly completed Accelerator students and send each student one email; record successful sending so retries cannot send duplicates.
- Send from The VApreneurs School with a branded template and this content:
  - **Subject:** Congratulations — you completed the 10-Day Accelerator!
  - **Opening:** Congratulations, [student name]! You have completed the 10-Day Accelerator and your VA course.
  - **Heading:** Done with your VA course — now what?
  - **Certificate message:** You will receive your certificate from us within the next three days.
  - **Feedback message:** In the meantime, please share feedback on how you found the classes and your experience. Your feedback helps us improve future cohorts.
  - **Button:** Share your feedback
- The feedback button opens the student's private feedback form in the portal. They sign in if their session has expired.
- **Certificate assumption:** you will create and send certificates yourself within three days; this phase does not generate certificates automatically.
- Add an instructor-visible completion/email status so you can see who completed, who was notified and whether feedback has arrived.

## 4. Add private student feedback
- Add a short feedback form available only to students who completed the relevant course.
- Ask for an overall rating from 1–5, what they found most useful, what could improve, and any additional comments about the classes and experience.
- Save one response per student per course, associated with their account so you can follow up. Do not publish responses publicly.
- Add a **Student feedback** tab to the instructor dashboard with course, student, rating, comments and submission date, plus course and rating filters.
- After submitting, show the student a thank-you message and keep their completion/certificate expectation visible.

## Email prerequisite
The project currently has no verified sender domain configured for app emails. The completion email cannot be delivered until your own sender domain is set up and verified. The progress dashboard, completion records and feedback form can be built independently; delivery testing must wait for email setup.

## Technical details
- Extend the existing admin-only data path with a narrowly authorised progress read function; do not widen student table permissions.
- Use the existing `module_progress`, `quiz_attempts`, `assignment_submissions` and active-enrolment records as the source of truth.
- Add a unique student/course completion record and a private feedback record with admin-only instructor reads and completion-checked student writes.
- Send the fixed completion template from protected server code only, using an idempotency key based on the student's completion record. A protected scheduled check provides reliable delivery without building a separate email queue.
- Preserve current course content, release dates, grading, retakes, enrolment permissions, branding and certificate FAQs.
- Verify: ten-day completion detection, no early email, no duplicate email, feedback access before/after completion, instructor progress totals, private data isolation, and desktop/mobile layouts.
