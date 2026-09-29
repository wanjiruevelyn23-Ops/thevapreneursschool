import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import type { Course } from "@/content/types";
import { isCourseAvailable } from "@/content/courses";
import { Button } from "@/components/ui/button";

export function CourseCard({ course }: { course: Course }) {
  const available = isCourseAvailable(course);

  return (
    <article className="surface-card flex flex-col p-6 transition-shadow hover:shadow-lift">
      <p className="eyebrow text-accent-deep">{course.eyebrow}</p>

      <h3 className="mt-3 text-xl text-primary">{course.title}</h3>

      <p className="mt-2 text-sm font-medium text-foreground/80">
        {course.tagline}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {course.description}
      </p>

      <ul className="mt-5 space-y-2">
        {course.outcomes.slice(0, 3).map((outcome) => (
          <li key={outcome} className="flex gap-2.5 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{outcome}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-mint px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-widest text-mint-foreground">
          Self-taught
        </span>

        {course.coaching ? (
          <span className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-widest text-accent-deep">
            + Add coaching
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
            <Lock className="h-3 w-3" /> No coaching track
          </span>
        )}
      </div>

      {/* Pricing + commencement */}
      <div className="mt-6 rounded-xl border border-primary/10 bg-primary/5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Investment
            </span>

            <span className="mt-0.5 text-xl font-extrabold tracking-tight text-primary">
              {course.price}
            </span>
          </div>

          {course.availableFrom ? (
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Commences
              </span>

              <span className="mt-0.5 text-sm font-semibold text-primary">
                {formatCourseDate(course.availableFrom)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 border-t border-primary/10 pt-3">
          <span
            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
              available
                ? "bg-mint text-mint-foreground"
                : "bg-accent/10 text-accent-deep"
            }`}
          >
            {available ? "Available now" : "Waiting list open"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
        <Button asChild variant="outline" size="sm">
          <Link
            to="/syllabus/$courseSlug"
            params={{ courseSlug: course.slug }}
          >
            View syllabus
          </Link>
        </Button>

        {available ? (
          <Button asChild variant="brand" size="sm">
            <Link
              to="/apply"
              search={{ course: course.slug, track: "self" }}
            >
              Apply
            </Link>
          </Button>
        ) : (
          <Button asChild variant="brand" size="sm">
            <Link
              to="/waiting-list"
              search={{ course: course.slug }}
            >
              Join Waiting List
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

function formatCourseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(year, month - 1, day));
}
