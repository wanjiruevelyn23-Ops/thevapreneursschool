import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Map as MapIcon,
  Rocket,
  LifeBuoy,
  Settings as SettingsIcon,
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
  useEnroll,
  useCompleteModule,
  useResetProgress,
  courseState,
} from "@/lib/lms";
import { COURSES, TOOLKIT_COURSES, ACCELERATOR, getCourse } from "@/content/courses";
import type { Course, CourseModule, LessonBlock } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/brand/Logo";
import { Eyebrow } from "@/components/brand/Section";
import { cn } from "@/lib/utils";

const TITLE = "Student Portal | The VApreneurs School";
const DESCRIPTION =
  "Your VApreneurs School student portal: modules, quizzes, notes and progress across every course you're enrolled in.";

export const Route = createFileRoute("/portal")({
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

type NavKey = "courses" | "route-map" | "accelerator" | "toolkit" | "settings";

const NAV: { key: NavKey; label: string; icon: typeof BookOpen }[] = [
  { key: "courses", label: "My courses", icon: BookOpen },
  { key: "route-map", label: "My route map", icon: MapIcon },
  { key: "accelerator", label: "Accelerator", icon: Rocket },
  { key: "toolkit", label: "Sustain toolkit", icon: LifeBuoy },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

function PortalPage() {
  const { user, loading } = useAuth();
  const [nav, setNav] = useState<NavKey>("courses");
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState<string | null>(null);

  const enrollments = useEnrollments(user?.id);
  const progress = useProgress(user?.id);
  const enroll = useEnroll(user?.id);

  if (loading) {
    return <Shell><p className="text-sm text-muted-foreground">Loading your portal…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <LockedCard
          title="Sign in to reach your portal"
          text="Your student portal holds your modules, quizzes, notes and progress. Sign in or create your student account to continue."
        >
          <Button asChild variant="brand">
            <Link to="/auth">Sign in / create account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">Browse courses</Link>
          </Button>
        </LockedCard>
      </Shell>
    );
  }

  const enrolled = enrollments.data ?? [];
  const enrolledSlugs = new Set(enrolled.map((e) => e.course_slug));
  const rows = progress.data ?? [];




  const activeCourse = openCourse ? getCourse(openCourse) : undefined;
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
              enrolledSlugs={enrolledSlugs}
              rows={rows}
              onOpen={(slug) => setOpenCourse(slug)}
              onEnrol={(slug, title) =>
                enroll.mutate(
                  { courseSlug: slug, track: "self" },
                  { onSuccess: () => toast.success(`Enrolled in ${title}`) },
                )
              }
            />
          ) : null}

          {nav === "courses" && activeCourse && !activeModule ? (
            <CourseView
              course={activeCourse}
              rows={rows}
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

          {nav === "route-map" ? <RouteMapView rows={rows} enrolledSlugs={enrolledSlugs} /> : null}
          {nav === "accelerator" ? <AcceleratorView /> : null}
          {nav === "toolkit" ? (
            <ToolkitView
              rows={rows}
              enrolledSlugs={enrolledSlugs}
              onOpen={(slug) => {
                setNav("courses");
                setOpenCourse(slug);
              }}
              onEnrol={(slug, title) =>
                enroll.mutate(
                  { courseSlug: slug, track: "self" },
                  { onSuccess: () => toast.success(`Enrolled in ${title}`) },
                )
              }
            />
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

function CourseRow({
  course,
  rows,
  isEnrolled,
  onOpen,
  onEnrol,
}: {
  course: Course;
  rows: Rows;
  isEnrolled: boolean;
  onOpen: (slug: string) => void;
  onEnrol: (slug: string, title: string) => void;
}) {
  const state = courseState(course, rows);
  return (
    <div className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-accent-deep">Waypoint {course.waypoint} · {course.category === "skill" ? "Skill track" : "Sustain toolkit"}</p>
          <h3 className="mt-2 font-display text-lg font-semibold text-primary">{course.title}</h3>
        </div>
        {isEnrolled ? (
          <Button size="sm" variant="brand" onClick={() => onOpen(course.slug)}>
            {state.completedCount ? "Continue" : "Start"}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onEnrol(course.slug, course.title)}>
            Enrol
          </Button>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Progress value={state.percent} className="h-2 flex-1" />
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {state.completedCount}/{state.total}
        </span>
      </div>
    </div>
  );
}

function MyCourses({
  enrolledSlugs,
  rows,
  onOpen,
  onEnrol,
}: {
  enrolledSlugs: Set<string>;
  rows: Rows;
  onOpen: (slug: string) => void;
  onEnrol: (slug: string, title: string) => void;
}) {
  return (
    <div>
      <Eyebrow>Student portal</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">My courses</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Modules unlock one at a time. Finish a module's quiz to open the next waypoint.
      </p>
      <div className="mt-8 space-y-3">
        {COURSES.map((course) => (
          <CourseRow
            key={course.slug}
            course={course}
            rows={rows}
            isEnrolled={enrolledSlugs.has(course.slug)}
            onOpen={onOpen}
            onEnrol={onEnrol}
          />
        ))}
      </div>
    </div>
  );
}

function CourseView({
  course,
  rows,
  onBack,
  onOpenModule,
}: {
  course: Course;
  rows: Rows;
  onBack: () => void;
  onOpenModule: (slug: string) => void;
}) {
  const state = courseState(course, rows);
  return (
    <div>
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-deep">
        <ArrowLeft className="h-4 w-4" /> My courses
      </button>
      <Eyebrow>{course.eyebrow}</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">{course.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <Progress value={state.percent} className="h-2 max-w-sm flex-1" />
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {state.percent}% complete
        </span>
      </div>

      <ol className="mt-8 space-y-3">
        {state.modules.map(({ module, isCompleted, isUnlocked, isCurrent }) => (
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
                    : isCurrent
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
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "Current module"
                      : "Locked — finish the previous module"}
                </span>
              </span>
              {!isUnlocked ? <Lock className="mt-1 h-4 w-4 text-muted-foreground" /> : null}
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
              <h2 key={index} className="pt-4 text-2xl text-primary">
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="pt-2 font-display text-lg font-semibold text-primary">
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

function downloadNotesDoc(title: string, fileName: string, paragraphs: string[]) {
  const body = paragraphs
    .map((paragraph) => `<p style="font-family:Calibri,sans-serif;font-size:11pt">${paragraph}</p>`)
    .join("");
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${title}</title></head><body><h1 style="font-family:Georgia,serif">${title}</h1>${body}</body></html>`;
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  const hasLesson = module.lesson.length > 0;

  function submitQuiz() {
    const total = module.quiz.length;
    const score = module.quiz.filter((q) => answers[q.id] === q.answerIndex).length;
    setResult({ score, total });
    if (score === total) {
      complete.mutate(
        { courseSlug: course.slug, moduleSlug: module.slug, score, total },
        { onSuccess: () => toast.success("Perfect score — next module unlocked!") },
      );
    }
  }

  return (
    <div>
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-deep">
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </button>
      <Eyebrow>Module {module.number}{module.duration ? ` · ${module.duration}` : ""}</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">{module.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{module.summary}</p>

      {!showQuiz ? (
        <>
          <div className="mt-8">
            {hasLesson ? (
              <LessonBody blocks={module.lesson} />
            ) : (
              <div className="surface-card p-6">
                <p className="text-sm text-muted-foreground">
                  The lesson content for this module is being written and will appear here as
                  soon as it's published. You can still mark it complete to continue testing
                  the route.
                </p>
              </div>
            )}
          </div>

          {module.notes ? (
            <div className="mt-10 surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-accent-deep">Notes</p>
                  <p className="mt-2 text-sm font-medium text-primary">{module.notes.title}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowNotes((v) => !v)}>
                    <NotebookPen className="h-4 w-4" />
                    {showNotes ? "Hide notes" : "Show notes"}
                  </Button>
                  <Button
                    size="sm"
                    variant="softMint"
                    onClick={() =>
                      module.notes &&
                      downloadNotesDoc(
                        module.notes.title,
                        module.notes.fileName,
                        module.notes.paragraphs,
                      )
                    }
                  >
                    <FileDown className="h-4 w-4" /> Word doc
                  </Button>
                </div>
              </div>
              {showNotes ? (
                <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm leading-relaxed text-foreground/80">
                  {module.notes.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
            {module.quiz.length ? (
              <Button variant="brand" size="lg" onClick={() => setShowQuiz(true)}>
                Take the module quiz
              </Button>
            ) : (
              <Button
                variant="brand"
                size="lg"
                onClick={() =>
                  complete.mutate(
                    { courseSlug: course.slug, moduleSlug: module.slug, score: null, total: null },
                    { onSuccess: () => toast.success("Module marked complete.") },
                  )
                }
              >
                Mark module complete
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="mt-8 surface-card p-6">
          <Eyebrow>Module {module.number} quiz</Eyebrow>
          <p className="mt-3 text-sm text-muted-foreground">
            {module.quiz.length} questions. A perfect score completes the module and unlocks
            the next one.
          </p>

          <div className="mt-6 space-y-6">
            {module.quiz.map((question, questionIndex) => (
              <fieldset key={question.id}>
                <legend className="text-sm font-medium text-primary">
                  {questionIndex + 1}. {question.question}
                </legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex;
                    const isRight = result && optionIndex === question.answerIndex;
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
                {result && question.explanation ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {question.explanation}
                  </p>
                ) : null}
              </fieldset>
            ))}
          </div>

          {!result ? (
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
                You scored {result.score} / {result.total}
              </p>
              {result.score === result.total ? (
                <>
                  <p className="mt-1 text-sm text-primary">
                    Perfect score. This module is complete and the next one is unlocked.
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
                            score: result.score,
                            total: result.total,
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
      )}
    </div>
  );
}

function RouteMapView({ rows, enrolledSlugs }: { rows: Rows; enrolledSlugs: Set<string> }) {
  const totals = COURSES.reduce(
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
      <h1 className="mt-3 text-3xl text-primary">My route map</h1>
      <div className="mt-6 surface-card p-6">
        <p className="font-display text-4xl font-semibold text-primary">{percent}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {totals.completed} of {totals.total} modules complete across all courses.
        </p>
        <Progress value={percent} className="mt-4 h-2" />
      </div>

      <div className="mt-8 space-y-3">
        {COURSES.map((course) => {
          const state = courseState(course, rows);
          return (
            <div key={course.slug} className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="eyebrow text-accent-deep">Waypoint {course.waypoint}</p>
                  <p className="mt-1.5 font-display text-base font-semibold text-primary">
                    {course.title}
                  </p>
                </div>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {enrolledSlugs.has(course.slug) ? `${state.percent}%` : "Not enrolled"}
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

function AcceleratorView() {
  return (
    <div>
      <Eyebrow>Waypoint 2 · Position yourself</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">{ACCELERATOR.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {ACCELERATOR.cohort} · {ACCELERATOR.length} · {ACCELERATOR.format}. Prerequisite:{" "}
        {ACCELERATOR.prerequisite.toLowerCase()}. {ACCELERATOR.seats}.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ACCELERATOR.pillars.map((pillar) => (
          <div key={pillar.number} className="surface-card p-5">
            <span className="font-mono text-xs text-accent-deep">Pillar 0{pillar.number}</span>
            <p className="mt-2 font-display text-base font-semibold text-primary">{pillar.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="brand">
          <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
            Apply to Cohort 1
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/accelerator">Full cohort details</Link>
        </Button>
      </div>
    </div>
  );
}

function ToolkitView({
  rows,
  enrolledSlugs,
  onOpen,
  onEnrol,
}: {
  rows: Rows;
  enrolledSlugs: Set<string>;
  onOpen: (slug: string) => void;
  onEnrol: (slug: string, title: string) => void;
}) {
  return (
    <div>
      <Eyebrow>Waypoint 3 · Sustain the business</Eyebrow>
      <h1 className="mt-3 text-3xl text-primary">Sustain toolkit</h1>
      <div className="mt-8 space-y-3">
        {TOOLKIT_COURSES.map((course) => (
          <CourseRow
            key={course.slug}
            course={course}
            rows={rows}
            isEnrolled={enrolledSlugs.has(course.slug)}
            onOpen={onOpen}
            onEnrol={onEnrol}
          />
        ))}
      </div>
    </div>
  );
}

function SettingsView({ email, userId }: { email: string; userId: string }) {
  const reset = useResetProgress(userId);
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
            await supabase.auth.signOut();
            toast.success("Signed out.");
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
