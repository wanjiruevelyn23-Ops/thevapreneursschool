# VA Route Map

Build "The VApreneurs School" — a training/mentorship website + LMS for virtual assistants, with the tagline "Map Your Skills, Scale Your Business."

BRAND
- Colors: Navy #0B2D48 (primary), Navy Deep #071B2C (dark sections/footer), Emerald #0F8B5F (accent/CTAs), Emerald Deep #0B6E4A (hover), Mint tint #E4F3EC (light backgrounds), Paper #F5F8F7 (page bg), Ink #0C1F2E (body text)
- Fonts: Fraunces (serif, headings — confident/editorial), Inter (body/nav), IBM Plex Mono (small labels, tags, "eyebrow" text, uppercase + letter-spaced)
- Logo mark: two small circular "waypoint" nodes connected by a diagonal ascending line (navy node → emerald node), paired with wordmark "VApreneurs School"
- Visual theme: the whole site is built around a literal "route map" metaphor — the student's journey has three Waypoints, and this numbering/waypoint language should show up in section labels throughout.

STRUCTURE (3 Waypoints)
1. Learn the skill — 4 self-taught skill tracks: Social Media Management (8 modules), Admin Virtual Assistance (5 modules), Project Management (6 modules), AI & Automation (6 modules). Each can be taken self-taught OR with an added-coaching option.
2. Position yourself — "Done With My VA Course... Now What?" — a live, cohort-based Accelerator (Cohort 1, 10 days, live + community format, prerequisite: any 1 skill track). Curriculum = 4 pillars: personal branding, market positioning, client acquisition, pricing your services.
3. Sustain the business — 3 standalone Sustain Toolkit courses: Imposter Syndrome, Dilemma Assessment, Finance Management as a Remote Worker.

PAGES
- Home: hero with tagline + route-map visual, 3-waypoint overview linking to Courses/Accelerator, Cohort 1 CTA banner.
- Courses: the 4 skill-track cards (with Self-taught / +Add coaching options) + the 3 Sustain Toolkit cards. Every course card has "View syllabus" and "Apply" actions.
- Accelerator: full pitch for the cohort, the 4-pillar curriculum, Cohort 1 details (10 days, live+community, prerequisite, limited seats), "who it's for" checklist, Apply CTA.
- About: "Our why" narrative (the gap between VA skills training and real business readiness), a CEO bio section for Eve Wanjiru (background in executive operations, business systems, and process optimization; founded the school to bridge technical skills and real-world readiness; vision is a thriving community of world-class African VAs who are globally competitive), and a values section.
- Contact: form with fields name/email/topic dropdown/message. Dropdown options: "Applying to Cohort 1", "Question about a skill track", "Pick My Brain Session (1-hour consultation)", "Partnerships", "Something else". Plus a direct-contact info card (email, socials, response time).
- Syllabus (per course): module list + description, then two CTAs — "Apply — Self-taught" and "Apply — With coaching" (Toolkit courses only get the self-taught option since they have no coaching track).
- Apply: one shared application form (name, email, phone, experience level, message) that clearly shows which course + track the person is applying for.
- Student Portal (the most important piece — a real functioning mini-LMS, not just a mockup):
  - Locked by default with a message that it unlocks after enrolling in a course or the Accelerator.
  - Once unlocked: "My courses" view listing all 7 courses (4 skill tracks + 3 toolkit) with live progress bars.
  - Clicking a course shows its module list. Modules unlock sequentially — only the current module (and completed ones) are clickable; later ones show locked.
  - Clicking a module shows lesson content, then a "Take the module quiz" button leading to a short multiple-choice quiz for that module. A perfect score marks the module complete and unlocks the next one; a lower score offers "retake" or "mark complete anyway" so testing isn't blocked.
  - Progress must persist per student per course (needs real backend/auth — please set up accounts + a database-backed enrollments/progress model).
  - Side nav: My courses, My route map (overall progress across all courses), Accelerator (cohort info + apply link), Sustain toolkit (filtered course list), Settings (includes a "reset progress" option for testing).
  - Real content exists for Module 1 of Social Media Management already: a full lesson on the SMART goals framework, audience research (demographics/psychographics/behavioural layers), competitive analysis (7 audit areas), and platform selection — plus a 4-question quiz written from that content, and a "Notes" toggle that reveals the full original, unedited notes plus a downloadable Word doc of the source material. I'll be sending you the rest of the module content (all other modules, all other courses) incrementally — please build the module/lesson data model so new modules + quizzes + notes docs can be dropped in easily as I provide them, rather than hardcoding content into components.

This is based on a working HTML/CSS/JS prototype I built and tested — the flows, unlocking logic, and quiz/pass-retry behavior described above are already validated, so please implement them faithfully. I'll follow up in this project with more course content and refinements once the initial build is up.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thevapreneursschool.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e549e8fd-7bda-44ce-94cf-f31ddcaf9219).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
