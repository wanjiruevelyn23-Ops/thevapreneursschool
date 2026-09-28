import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface Course {
  slug: string;
  title: string;
  priceKES: number;
  isFree: boolean;
  requiresWaitingList: boolean;
  description: string;
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="surface-card flex flex-col justify-between p-6 rounded-xl border border-border/50 bg-card">
      <div>
        <h3 className="font-display text-xl font-bold text-primary">{course.title}</h3>
        
        {/* 🏷️ DYNAMIC TUITION BADGE INFRASTRUCTURE */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
            {course.isFree ? "🎁 FREE TRACK" : `Ksh ${course.priceKES.toLocaleString()}`}
          </span>
          {course.requiresWaitingList && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
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
