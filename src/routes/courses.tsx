import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand/Section";
import { SectionHeading } from "@/components/brand/SectionHeading";

const TITLE = "Courses — Skill Tracks & Sustain Toolkit | The VApreneurs School";
const DESCRIPTION =
  "Four self-taught VA skill tracks (social media, admin, project management, AI & automation) plus three Sustain Toolkit courses. Self-taught or with added coaching.";

export interface Course {
  slug: string;
  title: string;
  priceKES: number;
  isFree: boolean;
  requiresWaitingList: boolean;
  description: string;
}

// 🎓 Waypoint 1: Skill Tracks Catalog Map
export const SKILL_TRACKS: Course[] = [
  {
    slug: "admin-va",
    title: "Administrative Virtual Assistant Core",
    priceKES: 3499,
    isFree: false,
    requiresWaitingList: true,
    description: "Master calendar optimization, inbox triaging pipelines, and professional corporate scheduling matrices."
  },
  {
    slug: "smm-va",
    title: "Social Media Management (SMM) Specialist",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    description: "Content scheduling calendars, audience engagement blueprints, and community growth mechanics."
  },
  {
    slug: "project-management",
    title: "Digital Project Management & Operations",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    description: "Structure cross-functional tasks using modern tools like Notion, Asana, and click-up sprint structures."
  },
  {
    slug: "ai-automation",
    title: "AI & Workflow Automation Architect",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    description: "Connect APIs with Make.com and Zapier to build self-running business infrastructure components."
  }
];

// 🧰 Waypoint 3: Sustain Toolkit Course Map
export const TOOLKIT_COURSES: Course[] = [
  {
    slug: "finance-management",
    title: "Financial Management for Digital Professionals",
    priceKES: 2999,
    isFree: false,
    requiresWaitingList: true,
    description: "Invoicing strategies, tax filing preparation loops, and multi-currency income allocation routines."
  },
  {
    slug: "imposter-syndrome",
    title: "Overcoming Imposter Syndrome & Scaling Confidently",
    priceKES: 2999,
    isFree: false,
    requiresWaitingList: true,
    description: "Psychological framing toolkits to confidently talk to high-ticket foreign corporate decision makers."
  },
  {
    slug: "dilemma-assessment",
    title: "The Dilemma Assessment & Strategy Guide",
    priceKES: 0,
    isFree: true,
    requiresWaitingList: true,
    description: "Identify client operation bottlenecks using our proprietary professional diagnostic mapping tool."
  }
];

// 📇 INLINE COMPONENT: Renders individual product layouts locally with dynamic pricing indicators
function CourseCard({ course }: { course: Course }) {
  return (
    <div className="surface-card flex flex-col justify-between p-6 rounded-xl border border-border/50">
      <div>
        <h3 className="font-display text-xl font-bold text-primary">{course.title}</h3>
        
        {/* 🏷️ DYNAMIC TUITION BADGE SYSTEM */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
            {course.isFree ? "🎁 FREE TRACK" : `Ksh ${course.priceKES.toLocaleString()}`}
          </span>
          {course.requiresWaitingList && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
              ⏳ Waitlist Active
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
      </div>

      <div className="mt-6">
        <Button asChild variant={course.requiresWaitingList ? "outline" : "brand"} className="w-full">
          <Link to="/apply" search={{ course: course.slug, track: "self" }}>
            {course.requiresWaitingList ? "Join the Waiting List" : "Enroll Now"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Eyebrow className="text-accent">Waypoint 1 &amp; Waypoint 3</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Pick your track. Learn it properly.
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/75">
            Every skill track can be taken self-taught, or with added coaching for
            feedback, accountability and portfolio review. The Sustain Toolkit
            courses are short, standalone and self-taught.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Waypoint 1 · Learn the skill"
          title="Skill tracks"
          intro="Choose one track to start. Completing any track unlocks eligibility for the Accelerator."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SKILL_TRACKS.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-accent/30 bg-mint/60 p-6">
          <Eyebrow>How the two options differ</Eyebrow>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-display text-lg font-semibold text-primary">Self-taught</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Full module library, quizzes and downloadable notes in the student
                portal. Move at your own pace with sequential module unlocking.
              </p>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-primary">
                + Add coaching
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Everything in self-taught, plus scheduled coaching calls, work
                review on your module deliverables and direct feedback on your
                portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sustain" className="bg-mint/60 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Waypoint 3 · Sustain the business"
            title="Sustain Toolkit"
            intro="Standalone courses for the mindset, decisions and money habits that keep a VA business alive. Self-taught only."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TOOLKIT_COURSES.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="surface-card flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Waypoint 2 · Position yourself</Eyebrow>
            <h2 className="mt-3 text-2xl text-primary">
              Finished a track? Cohort 1 is next.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              10 days, live sessions plus community. Prerequisite: any one skill track.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/accelerator">Accelerator</Link>
            </Button>
            <Button asChild variant="brand">
              <Link to="/apply" search={{ course: "accelerator-cohort-1", track: "coaching" }}>
                Apply
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
