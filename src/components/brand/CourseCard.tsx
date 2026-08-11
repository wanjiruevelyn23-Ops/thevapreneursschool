import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import type { Course } from "@/content/types";
import { Button } from "@/components/ui/button";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="surface-card flex flex-col p-6 transition-shadow hover:shadow-lift">
      <p className="eyebrow text-accent-deep">{course.eyebrow}</p>
      <h3 className="mt-3 text-xl text-primary">{course.title}</h3>
      <p className="mt-2 text-sm font-medium text-foreground/80">{course.tagline}</p>
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

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
        <Button asChild variant="outline" size="sm">
          <Link to="/syllabus/$courseSlug" params={{ courseSlug: course.slug }}>
            View syllabus
          </Link>
        </Button>
        <Button asChild variant="brand" size="sm">
          <Link to="/apply" search={{ course: course.slug, track: "self" }}>
            Apply
          </Link>
        </Button>
      </div>
    </article>
  );
}
