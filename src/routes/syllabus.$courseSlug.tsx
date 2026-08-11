import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock, FileText } from "lucide-react";
import { getCourse } from "@/content/courses";
import type { Course } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand/Section";

export const Route = createFileRoute("/syllabus/$courseSlug")({
  loader: ({ params }) => {
    const course = getCourse(params.courseSlug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Syllabus unavailable" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.course.title} Syllabus | The VApreneurs School`;
    const description = loaderData.course.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SyllabusPage,
});

function SyllabusPage() {
  const { course } = Route.useLoaderData() as { course: Course };

  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <Eyebrow className="text-accent">
            Waypoint {course.waypoint} · {course.eyebrow}
          </Eyebrow>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/75">{course.description}</p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="text-2xl text-primary">What you'll be able to do</h2>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {course.outcomes.map((outcome) => (
            <li
              key={outcome}
              className="rounded-lg border border-border bg-card p-3 text-sm text-foreground/85"
            >
              {outcome}
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl text-primary">Modules</h2>
        <ol className="mt-6 space-y-3">
          {course.modules.map((module) => (
            <li key={module.slug} className="surface-card flex gap-4 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-xs text-mint-foreground">
                {module.number}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-primary">
                  {module.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {module.summary}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-widest text-accent-deep">
                  {module.duration ? <span>{module.duration}</span> : null}
                  {module.quiz.length ? <span>{module.quiz.length}-question quiz</span> : null}
                  {module.notes ? (
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Notes included
                    </span>
                  ) : null}
                  {!module.lesson.length ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" /> Publishing soon
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 surface-card p-7">
          <Eyebrow>Ready to start?</Eyebrow>
          <h2 className="mt-3 text-2xl text-primary">Choose your track</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {course.coaching
              ? "Take it self-taught, or add coaching for feedback and accountability."
              : "This Sustain Toolkit course is self-taught only."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="brand">
              <Link to="/apply" search={{ course: course.slug, track: "self" }}>
                Apply — Self-taught
              </Link>
            </Button>
            {course.coaching ? (
              <Button asChild variant="navy">
                <Link to="/apply" search={{ course: course.slug, track: "coaching" }}>
                  Apply — With coaching
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
