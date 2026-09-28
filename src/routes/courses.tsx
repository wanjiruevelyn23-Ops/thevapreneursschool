import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading, Eyebrow } from "@/components/brand/Section";
import { CourseCard } from "@/components/brand/CourseCard";
import { SKILL_TRACKS, TOOLKIT_COURSES } from "@/content/courses";

const TITLE = "Courses — Skill Tracks & Sustain Toolkit | The VApreneurs School";
const DESCRIPTION =
  "Four self-taught VA skill tracks (social media, admin, project management, AI & automation) plus three Sustain Toolkit courses. Self-taught or with added coaching.";

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
              <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
                Apply
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
