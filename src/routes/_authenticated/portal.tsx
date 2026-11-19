import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Map as MapIcon,
  Settings as SettingsIcon,
  CalendarClock,
  PlayCircle,
  Lock,
  Check,
  ArrowLeft,
  FileDown,
  NotebookPen,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  useEnrollments,
  useProgress,
  useCompleteModule,
  useResetProgress,
  courseState,
  type SubmitResult,
} from "@/lib/lms";
import {
  useStudentCourses,
  getModuleFileUrl,
  formatFileSize,
  overrideKey,
} from "@/lib/content-overrides";
import { videoEmbedUrl } from "@/lib/video";
import type { Course, CourseModule, LessonBlock, ModuleResource } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/brand/Logo";
import { Eyebrow } from "@/components/brand/Section";
import { cn } from "@/lib/utils";
import { AssignmentSubmit } from "@/components/portal/AssignmentSubmit";

const TITLE = "Student Portal | The VApreneurs School";
const DESCRIPTION =
  "Your VApreneurs School student portal: modules, quizzes, notes and progress across every course you're enrolled in.";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PortalPage,
});

type NavKey = "courses" | "route-map" | "settings";

const NAV: { key: NavKey; label: string; icon: typeof BookOpen }[] = [
  { key: "courses", label: "My courses", icon: BookOpen },
  { key: "route-map", label: "My progress", icon: MapIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

/** Per-course lesson availability, as decided by the database. */
export type Availability = {
  released: Set<string>;
  upcoming: Map<string, string>;
};

function PortalPage() {
  const { user, loading } = useAuth();
  const [nav, setNav] = useState<NavKey>("courses");
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState<string | null>(null);

  const enrollments = useEnrollments(user?.id);
  const progress = useProgress(user?.id);
  const { courses: allCourses, released, upcoming } = useStudentCourses(user?.id);
  const availability: Availability = { released, upcoming };

  if (loading) {
    return <Shell><p className="text-sm text-muted-foreground">Loading your portal…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <LockedCard
          title="Sign in to reach your portal"
          text="Your student portal holds your modules, quizzes, notes and progress. Sign in to continue."
        >
          <Button asChild variant="brand">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">Browse courses</Link>
          </Button>
        </LockedCard>
      </Shell>
    );
  }

  if (!user.email_confirmed_at) {
    return (
      <Shell email={user.email}>
        <LockedCard
          title="Please verify your email"
          text="Open the confirmation link we emailed you, then sign in again to reach your portal."
        >
          <Button
            variant="brand"
            onClick={async () => {
              const { error } = await supabase.auth.resend({ type: "signup", email: user.email ?? "" });
              if (error) toast.error(error.message);
              else toast.success("Confirmation email sent.");
            }}
          >
            Resend email
          </Button>
        </LockedCard>
      </Shell>
    );
  }

  const enrolled = enrollments.data ?? [];
  const enrolledSlugs = new Set(
    enrolled.filter((e) => e.access_status === "active").map((e) => e.course_slug),
  );
  const rows = progress.data ?? [];
  // Only courses this student is actually enrolled in ever reach the dashboard.
  const myCourses = allCourses.filter((course) => enrolledSlugs.has(course.slug));
  const waiting = enrolled.filter(
    (e) => e.access_status !== "active" && e.enrollment_status !== "cancelled",
  );



  const activeCourse = openCourse
    ? myCourses.find((course) => course.slug === openCourse)
    : undefined;
  const activeModule =
    activeCourse && openModule
      ? activeCourse.modules.find((m) => m.slug === openModule)
      : undefined;

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="bg-sidebar text-sidebar-foreground lg:min-h-screen lg:w-64 lg:shrink-0">
        <div className="px-5 py-5">
          <Link to="/">
            <Logo tone="light" />
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setNav(item.key);
                setOpenCourse(null);
                setOpenModule(null);
              }}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors",
                nav === item.key
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>



        <div className="hidden px-5 py-4 lg:block">
          <p className="font-mono text-[0.625rem] uppercase tracking-widest text-sidebar-foreground/50">
            Signed in
          </p>
          <p className="mt-1 truncate text-xs text-sidebar-foreground/80">{user.email}</p>
        </div>
      </aside>

      <div className="flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          {nav === "courses" && !activeCourse ? (
            <MyCourses
              courses={myCourses}
              waiting={waiting.map((e) => ({
                slug: e.course_slug,
                title: allCourses.find((c) => c.slug === e.course_slug)?.title ?? e.course_slug,
                status: e.enrollment_status,
                payment: e.payment_status,
              }))}
              rows={rows}
              availability={availability}
              onOpen={(slug) => setOpenCourse(slug)}
            />
          ) : null}

          {nav === "courses" && activeCourse && !activeModule ? (
            <CourseView
              course={activeCourse}
              rows={rows}
              availability={availability}
              onBack={() => setOpenCourse(null)}
              onOpenModule={(slug) => setOpenModule(slug)}
            />
          ) : null}

          {nav === "courses" && activeCourse && activeModule ? (
            <ModuleView
              course={activeCourse}
              module={activeModule}
              userId={user.id}
              onBack={() => setOpenModule(null)}
            />
          ) : null}

          {nav === "route-map" ? (
            <RouteMapView courses={myCourses} rows={rows} />
          ) : null}
          {nav === "settings" ? <SettingsView email={user.email ?? ""} userId={user.id} /> : null}
        </div>
      </div>
    </div>
  );
}

type Rows = ReturnType<typeof useProgress>["data"] extends (infer T)[] | undefined
  ? T[]
  : never;

function Shell({ children, email }: { children: React.ReactNode; email?: string | undefined }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-sidebar px-5 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/">
            <Logo tone="light" />
          </Link>
          {email ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-sidebar-foreground/60">
              {email}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-5 py-12">{children}</div>
    </div>
  );
}

function LockedCard({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint">
        <Lock className="h-5 w-5 text-accent-deep" />
      </span>
      <h1 className="mt-5 text-2xl text-primary">{title}</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

/** Release-gated courses open lessons on the instructor's schedule, not one-by-one. */
const isScheduled = (course: Course) => course.category === "cohort";

type LessonState = {
  module: CourseModule;
  isCompleted: boolean;
  isUnlocked: boolean;
  label: string;
};

function lessonStates(course: Course, rows: Rows, availability: Availability): LessonState[] {
  const state = courseState(course, rows);
  return state.modules.map(({ module, isCompleted, isUnlocked, isCurrent }) => {
    const key = overrideKey(course.slug, module.slug);
    if (!isScheduled(course)) {
      return {
        module,
        isCompleted,
        isUnlocked,
        label: isCompleted ? "Completed" : isCurrent ? "Current module" : "Locked — finish the previous module",
      };
    }
    const open = availability.released.has(key);
    const opensAt = availability.upcoming.get(key);
    return {
      module,
      isCompleted,
      isUnlocked: open,
      label: isCompleted
        ? "Completed"
        : open
          ? "Available"
          : opensAt
            ? `Upcoming · opens ${new Date(opensAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`
            : "Upcoming",
    };
  });
}

function MyCourses({
  courses,
  waiting,
  rows,
  availability,
  onOpen,
}: {
  courses: Course[];
  waiting: { slug: string; title: string; status: string; payment: string }[];
  rows: Rows;
  availability: Availability;
  onOpen: (slug: string) => void;
}) {
  return (
    <div>
      <Eyebrow>Student portal</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">My courses</h1>

      {courses.length === 0 && waiting.length === 0 ? (
        <div className="mt-6 rounded-lg border border-accent/30 bg-mint p-5">
          <p className="font-display text-base font-semibold text-primary">
            You don't have an active course enrolment yet
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Once your application is approved and your place is confirmed, your course will appear
            here.
          </p>
          <Button asChild size="sm" variant="brand" className="mt-4">
            <Link to="/courses">Browse courses</Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        {courses.map((course) => {
          const state = courseState(course, rows);
          const next = lessonStates(course, rows, availability).find(
            (l) => l.isUnlocked && !l.isCompleted,
          );
          return (
            <button
              key={course.slug}
              type="button"
              onClick={() => onOpen(course.slug)}
              className="surface-card block w-full p-5 text-left transition-colors hover:border-accent/60"
            >
              <p className="eyebrow text-accent-deep">{course.eyebrow}</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-primary">{course.title}</h2>
              <div className="mt-4 flex items-center gap-3">
                <Progress value={state.percent} className="h-2 flex-1" />
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {state.completedCount}/{state.total}
                </span>
              </div>
              <p className="mt-3 text-sm text-accent-deep">
                {next ? `Continue: ${next.module.title} →` : state.isFinished ? "Course complete" : "Open course →"}
              </p>
            </button>
          );
        })}

        {waiting.map((w) => (
          <div key={w.slug} className="rounded-xl border border-dashed border-border bg-card p-5">
            <p className="eyebrow text-muted-foreground">
              {w.status === "suspended" ? "Access paused" : "Awaiting confirmation"}
            </p>
            <p className="mt-2 font-display text-base font-semibold text-primary">{w.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {w.status === "suspended"
                ? "Contact info@thevapreneursschool.com to restore access."
                : w.payment === "unpaid"
                  ? "Your place opens once your enrolment is approved and payment is confirmed."
                  : "Your place is being activated — check back soon."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseView({
  course,
  rows,
  availability,
  onBack,
  onOpenModule,
}: {
  course: Course;
  rows: Rows;
  availability: Availability;
  onBack: () => void;
  onOpenModule: (slug: string) => void;
}) {
  const state = courseState(course, rows);
  const lessons = lessonStates(course, rows, availability);
  const unit = isScheduled(course) ? "day" : "module";
  return (
    <div>
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-deep">
        <ArrowLeft className="h-4 w-4" /> My courses
      </button>
      <Eyebrow>{course.eyebrow}</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">{course.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{course.description}</p>
      <div className="mt-5 surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow text-accent-deep">Your progress</p>
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            {state.completedCount} of {state.total} {unit}s complete · {state.percent}%
          </span>
        </div>
        <Progress value={state.percent} className="mt-3 h-2" />
        {isScheduled(course) ? (
          <p className="mt-3 text-xs text-muted-foreground">
            New days open on the programme schedule. You can revisit any released day at any time.
          </p>
        ) : null}
      </div>

      <ol className="mt-8 space-y-3">
        {lessons.map(({ module, isCompleted, isUnlocked, label }) => (
          <li key={module.slug}>
            <button
              type="button"
              disabled={!isUnlocked}
              onClick={() => onOpenModule(module.slug)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors",
                isUnlocked
                  ? "border-border bg-card hover:border-accent/60"
                  : "cursor-not-allowed border-dashed border-border bg-muted/40 opacity-70",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isUnlocked
                      ? "bg-mint text-mint-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : module.number}
              </span>
              <span className="flex-1">
                <span className="block font-display text-base font-semibold text-primary">
                  {module.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{module.summary}</span>
                <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-widest text-accent-deep">
                  {label}
                </span>
              </span>
              {!isUnlocked ? (
                isScheduled(course) ? (
                  <CalendarClock className="mt-1 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="mt-1 h-4 w-4 text-muted-foreground" />
                )
              ) : null}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="mt-8 border-l-4 border-accent pl-4 text-2xl text-primary"
              >
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="pt-2 font-display text-lg font-semibold text-accent-deep">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={index} className="text-[0.9375rem] leading-relaxed text-foreground/85">
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={index} className="list-decimal space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="list-disc space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <div key={index} className="rounded-xl border border-accent/30 bg-mint/70 p-5">
                <p className="eyebrow text-accent-deep">{block.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-primary">{block.text}</p>
              </div>
            );
          case "quote":
            return (
              <blockquote key={index} className="border-l-2 border-accent pl-5 font-display text-lg text-primary">
                {block.text}
              </blockquote>
            );
          case "table":
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-mint/60">
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} className="px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-widest text-accent-deep">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-border">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2.5 text-foreground/85">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function blocksToDocHtml(blocks: LessonBlock[]) {
  const navy = "#0B2D48";
  const emerald = "#0F8B5F";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2 style="font-family:Georgia,serif;color:${navy}">${block.text}</h2>`;
        case "subheading":
          return `<h3 style="font-family:Georgia,serif;color:${emerald}">${block.text}</h3>`;
        case "paragraph":
          return `<p style="font-family:Calibri,sans-serif;font-size:11pt;color:#0C1F2E">${block.text}</p>`;
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          return `<${tag} style="font-family:Calibri,sans-serif;font-size:11pt;color:#0C1F2E">${block.items
            .map((item) => `<li>${item}</li>`)
            .join("")}</${tag}>`;
        }
        case "callout":
          return `<p style="font-family:Calibri,sans-serif;font-size:11pt;background:#E4F3EC;border-left:4px solid ${emerald};padding:8pt"><b style="color:${emerald}">${block.title}:</b> ${block.text}</p>`;
        case "quote":
          return `<p style="font-family:Georgia,serif;font-style:italic;color:${navy}">${block.text}</p>`;
        case "table":
          return `<table border="1" cellpadding="6" style="border-collapse:collapse;font-family:Calibri,sans-serif;font-size:11pt"><tr>${block.headers
            .map((h) => `<th style="background:#E4F3EC;color:${navy};text-align:left">${h}</th>`)
            .join("")}</tr>${block.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
            .join("")}</table>`;
        default:
          return "";
      }
    })
    .join("");
}

function downloadNotesDoc(title: string, fileName: string, blocks: LessonBlock[]) {
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${title}</title></head><body><h1 style="font-family:Georgia,serif;color:#0B2D48">${title}</h1>${blocksToDocHtml(blocks)}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}


function ModuleView({
  course,
  module,
  userId,
  onBack,
}: {
  course: Course;
  module: CourseModule;
  userId: string;
  onBack: () => void;
}) {
  const complete = useCompleteModule(userId);
  const [tab, setTab] = useState<"lesson" | "slides" | "resources" | "quiz" | "assignment">("lesson");

  // Record that the student opened this lesson (ignored by the database if not released).
  useEffect(() => {
    void supabase.rpc("touch_module", { _course_slug: course.slug, _module_slug: module.slug });
  }, [course.slug, module.slug]);
  const embed = videoEmbedUrl(module.videoUrl);
  const unit = course.category === "cohort" ? "Day" : "Module";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);

  const hasLesson = module.lesson.length > 0;

  function submitQuiz() {
    complete.mutate(
      { courseSlug: course.slug, moduleSlug: module.slug, answers },
      {
        onSuccess: (res) => {
          setResult(res);
          if (res.completed) toast.success("Quiz complete — well done!");
          else toast.success("Answers submitted.");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <div>
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-deep">
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </button>
      <Eyebrow>{unit} {module.number}{module.duration ? ` · ${module.duration}` : ""}</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">{module.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{module.summary}</p>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
        {([
          { key: "lesson" as const, label: "Lesson" },
          { key: "slides" as const, label: "Slides" },
          { key: "resources" as const, label: "Resources" },
          { key: "assignment" as const, label: "Assignment" },
          { key: "quiz" as const, label: "Quiz" },
        ]).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-widest transition-colors",
              tab === item.key
                ? "border-accent text-accent-deep"
                : "border-transparent text-muted-foreground hover:text-accent-deep",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "slides" ? (
        <div className="mt-8">
          {module.slides?.length ? (
            <ModuleDownloads title="Presentation slides" resources={module.slides} />
          ) : (
            <p className="surface-card p-6 text-sm text-muted-foreground">
              Slides for this lesson haven't been shared yet.
            </p>
          )}
        </div>
      ) : null}

      {tab === "resources" ? (
        <div className="mt-8">
          {module.resources?.length ? (
            <ModuleDownloads title="Lesson resources" resources={module.resources} />
          ) : (
            <p className="surface-card p-6 text-sm text-muted-foreground">
              No extra resources for this lesson.
            </p>
          )}
        </div>
      ) : null}

      {tab === "lesson" ? (
        <>
          <div className="mt-8">
            {embed ? (
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                <iframe
                  src={embed}
                  title={`${module.title} video`}
                  className="h-full w-full"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : module.videoUrl ? (
              <a
                href={module.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-5 text-sm text-primary hover:border-accent"
              >
                <PlayCircle className="h-5 w-5 text-accent" /> Watch the video lesson
              </a>
            ) : course.category === "cohort" ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 text-center">
                <PlayCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">The video for this day will appear here.</p>
              </div>
            ) : null}
          </div>
          {module.notes ? (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-lg font-semibold text-primary">
                  {module.notes.title}
                </p>
                <Button
                  size="sm"
                  variant="softMint"
                  onClick={() =>
                    module.notes &&
                    downloadNotesDoc(
                      module.notes.title,
                      module.notes.fileName,
                      module.notes.blocks,
                    )
                  }
                >
                  <FileDown className="h-4 w-4" /> Word doc
                </Button>
              </div>
              {module.notes.intro ? (
                <p className="mt-4 rounded-xl border-l-4 border-accent bg-mint/60 p-4 text-[0.9375rem] leading-relaxed text-primary">
                  {module.notes.intro}
                </p>
              ) : null}
              <div className="mt-5 border-t border-border pt-5">
                <LessonBody blocks={module.notes.blocks} />
              </div>
            </div>

          ) : (
            <div className="mt-8">
              {hasLesson ? (
                <LessonBody blocks={module.lesson} />
              ) : (
                <div className="surface-card p-6">
                  <p className="text-sm text-muted-foreground">
                    The notes for this module are being written and will appear here as soon as
                    they're published. You can still mark it complete to continue testing the
                    route.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
            {module.quiz.length ? (
              <Button variant="brand" size="lg" onClick={() => setTab("quiz")}>
                Take the quiz
              </Button>
            ) : (
              <Button
                variant="brand"
                size="lg"
                onClick={() =>
                  complete.mutate(
                    { courseSlug: course.slug, moduleSlug: module.slug, answers: {} },
                    { onSuccess: () => toast.success("Module marked complete.") },
                  )
                }
              >
                Mark module complete
              </Button>
            )}
          </div>
        </>
      ) : null}

      {tab === "assignment" ? (
        <div className="mt-8 surface-card p-6">
          {module.assignment ? (
            <>
              <Eyebrow>{unit} {module.number} assignment</Eyebrow>
              <h2 className="mt-3 text-xl text-primary">{module.assignment.title}</h2>
              {module.assignment.intro ? (
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/85">
                  {module.assignment.intro}
                </p>
              ) : null}
              <ol className="mt-5 list-decimal space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {module.assignment.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ol>
              {module.assignment.deliverable ? (
                <div className="mt-6 rounded-xl border border-accent/30 bg-mint/70 p-5">
                  <p className="eyebrow text-accent-deep">What to hand in</p>
                  <p className="mt-2 text-sm leading-relaxed text-primary">
                    {module.assignment.deliverable}
                  </p>
                </div>
              ) : null}
              {module.assignment.criteria?.length ? (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="eyebrow text-accent-deep">How it's marked</p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-foreground/85">
                    {module.assignment.criteria.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <AssignmentSubmit userId={userId} courseSlug={course.slug} moduleSlug={module.slug} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              The assignment for this module is being written and will appear here as soon as
              it's published.
            </p>
          )}
        </div>
      ) : null}

      {tab === "quiz" ? (

        <div className="mt-8 surface-card p-6">
          <Eyebrow>{unit} {module.number} quiz</Eyebrow>
          {module.quiz.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">There's no quiz for this lesson.</p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {module.quiz.length} questions ·{" "}
              {module.quiz.reduce((sum, q) => sum + (q.marks ?? 1), 0)} marks.
            </p>
          )}

          <div className="mt-6 space-y-6">
            {module.quiz.map((question, questionIndex) => (
              <fieldset key={question.id}>
                <legend className="text-sm font-medium text-primary">
                  {questionIndex + 1}. {question.question}
                  {(question.marks ?? 1) > 1 ? (
                    <span className="ml-2 font-mono text-[0.625rem] text-muted-foreground">
                      {question.marks} marks
                    </span>
                  ) : null}
                </legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex;
                    const isRight = result && optionIndex === result.key[question.id]?.answerIndex;
                    const isWrongPick = result && selected && !isRight;
                    return (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm",
                          selected ? "border-accent bg-mint/60" : "border-border bg-card",
                          isRight && "border-accent bg-mint",
                          isWrongPick && "border-destructive/60",
                        )}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          checked={selected}
                          disabled={Boolean(result)}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                          }
                          className="mt-1 accent-[oklch(0.5642_0.1207_161.75)]"
                        />
                        <span className="text-foreground/85">{option}</span>
                      </label>
                    );
                  })}
                </div>
                {result?.key[question.id]?.explanation ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {result.key[question.id]?.explanation}
                  </p>
                ) : null}
              </fieldset>
            ))}
          </div>

          {module.quiz.length === 0 ? null : !result ? (
            <Button
              variant="brand"
              size="lg"
              className="mt-8"
              disabled={Object.keys(answers).length < module.quiz.length}
              onClick={submitQuiz}
            >
              Submit answers
            </Button>
          ) : (
            <div className="mt-8 rounded-xl border border-accent/30 bg-mint/70 p-5">
              <p className="font-display text-lg font-semibold text-primary">
                {result.score === null
                  ? "Answers submitted"
                  : `You scored ${result.score} / ${result.total}`}
              </p>
              {result.completed ? (
                <>
                  <p className="mt-1 text-sm text-primary">
                    {result.score === null
                      ? "Your instructor will review your results."
                      : "Full marks — this lesson is complete."}
                  </p>
                  <Button variant="brand" className="mt-4" onClick={onBack}>
                    Back to modules
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm text-primary">
                    Not a perfect score yet. Retake the quiz, or mark it complete anyway to
                    keep moving.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="brand"
                      onClick={() => {
                        setAnswers({});
                        setResult(null);
                      }}
                    >
                      Retake quiz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        complete.mutate(
                          {
                            courseSlug: course.slug,
                            moduleSlug: module.slug,
                            answers,
                            force: true,
                          },
                          {
                            onSuccess: () => {
                              toast.success("Module marked complete.");
                              onBack();
                            },
                          },
                        )
                      }
                    >
                      Mark complete anyway
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : null}

    </div>
  );
}

function RouteMapView({ courses, rows }: { courses: Course[]; rows: Rows }) {
  const totals = courses.reduce(
    (acc, course) => {
      const state = courseState(course, rows);
      return {
        completed: acc.completed + state.completedCount,
        total: acc.total + state.total,
      };
    },
    { completed: 0, total: 0 },
  );
  const percent = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0;

  return (
    <div>
      <Eyebrow>Overall progress</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">My progress</h1>
      <div className="mt-6 surface-card p-6">
        <p className="font-display text-4xl font-semibold text-primary">{percent}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {totals.completed} of {totals.total} modules complete across all courses.
        </p>
        <Progress value={percent} className="mt-4 h-2" />
      </div>

      <div className="mt-8 space-y-3">
        {courses.map((course) => {
          const state = courseState(course, rows);
          return (
            <div key={course.slug} className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="eyebrow text-accent-deep">{course.eyebrow}</p>
                  <p className="mt-1.5 font-display text-base font-semibold text-primary">
                    {course.title}
                  </p>
                </div>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {state.percent}%
                </span>
              </div>
              <Progress value={state.percent} className="mt-3 h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsView({ email, userId }: { email: string; userId: string }) {
  const reset = useResetProgress(userId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return (
    <div>
      <Eyebrow>Account</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">Settings</h1>

      <div className="mt-8 surface-card p-6">
        <p className="eyebrow text-accent-deep">Signed in as</p>
        <p className="mt-2 text-sm text-foreground">{email}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={async () => {
            await queryClient.cancelQueries();
            queryClient.clear();
            await supabase.auth.signOut();
            localStorage.removeItem("vaps-session-only");
            toast.success("Signed out.");
            void navigate({ to: "/auth", replace: true });
          }}
        >
          Sign out
        </Button>
      </div>

      <div className="mt-4 surface-card p-6">
        <p className="eyebrow text-accent-deep">Testing tools</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Reset progress clears every completed module and locks all courses back to module 1.
          Enrolments stay in place.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={reset.isPending}
          onClick={() =>
            reset.mutate(undefined, {
              onSuccess: () => toast.success("Progress reset."),
            })
          }
        >
          {reset.isPending ? "Resetting…" : "Reset all progress"}
        </Button>
      </div>
    </div>
  );
}

/** Instructor-uploaded files students can download for a module. */
function ModuleDownloads({ resources, title = "Downloads" }: { resources: ModuleResource[]; title?: string }) {
  if (resources.length === 0) return null;

  async function open(resource: ModuleResource) {
    const url = await getModuleFileUrl(resource.path);
    if (!url) {
      toast.error("That file couldn't be opened. Please try again.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {resources.map((resource) => (
          <li key={resource.path}>
            <button
              type="button"
              onClick={() => void open(resource)}
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-primary transition-colors hover:border-accent"
            >
              <FileDown className="h-4 w-4 shrink-0 text-accent" />
              <span className="min-w-0 flex-1 truncate">{resource.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatFileSize(resource.size)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
