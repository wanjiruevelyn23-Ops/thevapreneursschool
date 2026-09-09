import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { COURSES } from "@/content/courses";
import type {
  CourseModule,
  LessonBlock,
  ModuleAssignment,
  ModuleNotes,
  QuizQuestion,
} from "@/content/types";
import { useModuleOverrides, overrideKey } from "@/lib/content-overrides";
import { BlockEditor } from "@/components/instructor/BlockEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/brand/Logo";
import { Eyebrow } from "@/components/brand/Section";
import { cn } from "@/lib/utils";

const TITLE = "Instructor Studio | The VApreneurs School";
const DESCRIPTION =
  "Write and publish module notes, lessons, quizzes and assignments for VApreneurs School students.";

export const Route = createFileRoute("/admin/instructor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: InstructorPage,
});

type Draft = {
  title: string;
  summary: string;
  duration: string;
  lesson: LessonBlock[];
  notes: ModuleNotes;
  quiz: QuizQuestion[];
  assignment: ModuleAssignment;
};

const emptyNotes = (title: string): ModuleNotes => ({
  title: `${title} — notes`,
  fileName: "module-notes.docx",
  intro: "",
  blocks: [],
});

const emptyAssignment = (): ModuleAssignment => ({
  title: "",
  intro: "",
  tasks: [],
  deliverable: "",
  criteria: [],
});

function InstructorPage() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { rows, map, loading: loadingContent, reload } = useModuleOverrides(user?.id);

  const [courseSlug, setCourseSlug] = useState(COURSES[0]?.slug ?? "");
  const [moduleSlug, setModuleSlug] = useState(COURSES[0]?.modules[0]?.slug ?? "");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const course = useMemo(() => COURSES.find((c) => c.slug === courseSlug), [courseSlug]);
  const builtIn = useMemo(
    () => course?.modules.find((m) => m.slug === moduleSlug),
    [course, moduleSlug],
  );
  const stored = map.get(overrideKey(courseSlug, moduleSlug));

  // Load the selected module into the editor: stored version first, built-in as fallback.
  useEffect(() => {
    if (!builtIn) return;
    setDraft(fromSources(builtIn, stored));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, moduleSlug, stored?.id, stored?.updated_at, builtIn?.slug]);

  if (loading) {
    return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="text-2xl text-primary">Instructor sign-in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your instructor account to write and publish course material.
        </p>
        <Button asChild variant="brand" className="mt-4">
          <Link to="/auth">Sign in</Link>
        </Button>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell email={user.email ?? undefined}>
        <h1 className="text-2xl text-primary">Instructors only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account doesn't have instructor access. Ask the school owner to grant it.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/portal">Back to portal</Link>
        </Button>
      </Shell>
    );
  }

  async function save(publish: boolean) {
    if (!draft || !builtIn) return;
    setSaving(true);
    const payload = {
      course_slug: courseSlug,
      module_slug: moduleSlug,
      title: draft.title.trim() || null,
      summary: draft.summary.trim() || null,
      duration: draft.duration.trim() || null,
      lesson: draft.lesson,
      quiz: draft.quiz,
      notes: draft.notes.blocks.length ? draft.notes : null,
      assignment: draft.assignment.tasks.length || draft.assignment.title.trim()
        ? draft.assignment
        : null,
      published: publish,
      updated_by: user!.id,
    };
    const { error } = await supabase
      .from("module_content")
      .upsert(payload as never, { onConflict: "course_slug,module_slug" });
    setSaving(false);
    if (error) {
      toast.error("Could not save", { description: error.message });
      return;
    }
    toast.success(publish ? "Published to students" : "Draft saved");
    await reload();
  }

  async function removeOverride() {
    if (!stored) return;
    const { error } = await supabase.from("module_content").delete().eq("id", stored.id);
    if (error) {
      toast.error("Could not reset", { description: error.message });
      return;
    }
    toast.success("Reset to the built-in version");
    await reload();
  }

  const publishedCount = rows.filter((r) => r.published).length;

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="bg-sidebar text-sidebar-foreground lg:min-h-screen lg:w-72 lg:shrink-0">
        <div className="px-5 py-5">
          <Link to="/">
            <Logo tone="light" />
          </Link>
        </div>
        <div className="px-5 pb-3">
          <p className="font-mono text-[11px] tracking-[0.12em] text-sidebar-foreground/60 uppercase">
            Instructor studio
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            {publishedCount} module{publishedCount === 1 ? "" : "s"} published
          </p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-3 pb-6 lg:max-h-none">
          {COURSES.map((c) => (
            <div key={c.slug} className="mb-3">
              <p className="px-2 py-1.5 text-xs font-semibold text-sidebar-foreground/80">
                {c.title}
              </p>
              <ul>
                {c.modules.map((m) => {
                  const row = map.get(overrideKey(c.slug, m.slug));
                  const active = c.slug === courseSlug && m.slug === moduleSlug;
                  return (
                    <li key={m.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          setCourseSlug(c.slug);
                          setModuleSlug(m.slug);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                          active
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <span className="w-4 shrink-0 text-xs opacity-70">{m.number}</span>
                        <span className="flex-1 truncate">{m.title}</span>
                        {row ? (
                          <span
                            className={cn(
                              "shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] uppercase",
                              row.published
                                ? "bg-accent text-accent-foreground"
                                : "bg-sidebar-accent text-sidebar-accent-foreground",
                            )}
                          >
                            {row.published ? "Live" : "Draft"}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/portal">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Portal
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/submissions">Submissions</Link>
              </Button>
              {builtIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDraft(fromSources(builtIn, undefined))}
                >
                  <Upload className="mr-1.5 h-4 w-4" /> Load built-in text
                </Button>
              ) : null}
              {stored ? (
                <Button variant="outline" size="sm" onClick={removeOverride}>
                  <Trash2 className="mr-1.5 h-4 w-4" /> Reset module
                </Button>
              ) : null}
            </div>
          </div>

          <Eyebrow className="mt-6">
            {course?.title} · Module {builtIn?.number}
          </Eyebrow>
          <h1 className="mt-3 text-3xl text-primary">{draft?.title || builtIn?.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {stored
              ? stored.published
                ? "Live for students. Any change you publish replaces what they see."
                : "Saved as a draft — students still see the previous version."
              : "No instructor version yet. Write it below, then publish."}
            {loadingContent ? " Loading saved content…" : ""}
          </p>

          {draft ? (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Module title">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </Field>
                <Field label="Study time">
                  <Input
                    value={draft.duration}
                    placeholder="e.g. 50 min"
                    onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Short summary">
                    <Textarea
                      rows={2}
                      value={draft.summary}
                      onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                    />
                  </Field>
                </div>
              </div>

              <Tabs defaultValue="notes" className="mt-8">
                <TabsList>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="lesson">Lesson</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="assignment">Assignment</TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Notes title">
                      <Input
                        value={draft.notes.title}
                        onChange={(e) =>
                          setDraft({ ...draft, notes: { ...draft.notes, title: e.target.value } })
                        }
                      />
                    </Field>
                    <Field label="Download file name">
                      <Input
                        value={draft.notes.fileName}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            notes: { ...draft.notes, fileName: e.target.value },
                          })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Intro line (optional)">
                    <Textarea
                      rows={2}
                      value={draft.notes.intro ?? ""}
                      onChange={(e) =>
                        setDraft({ ...draft, notes: { ...draft.notes, intro: e.target.value } })
                      }
                    />
                  </Field>
                  <BlockEditor
                    label="Notes content"
                    blocks={draft.notes.blocks}
                    onChange={(blocks) => setDraft({ ...draft, notes: { ...draft.notes, blocks } })}
                  />
                </TabsContent>

                <TabsContent value="lesson" className="mt-6">
                  <BlockEditor
                    label="Lesson content"
                    blocks={draft.lesson}
                    onChange={(lesson) => setDraft({ ...draft, lesson })}
                  />
                </TabsContent>

                <TabsContent value="quiz" className="mt-6">
                  <QuizEditor
                    quiz={draft.quiz}
                    onChange={(quiz) => setDraft({ ...draft, quiz })}
                  />
                </TabsContent>

                <TabsContent value="assignment" className="mt-6 space-y-4">
                  <Field label="Assignment title">
                    <Input
                      value={draft.assignment.title}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          assignment: { ...draft.assignment, title: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Intro (optional)">
                    <Textarea
                      rows={2}
                      value={draft.assignment.intro ?? ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          assignment: { ...draft.assignment, intro: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Tasks — one per line">
                    <Textarea
                      rows={5}
                      value={draft.assignment.tasks.join("\n")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          assignment: {
                            ...draft.assignment,
                            tasks: e.target.value.split("\n").filter((l) => l.trim()),
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="What to hand in (optional)">
                    <Textarea
                      rows={2}
                      value={draft.assignment.deliverable ?? ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          assignment: { ...draft.assignment, deliverable: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="How it's marked — one point per line (optional)">
                    <Textarea
                      rows={4}
                      value={(draft.assignment.criteria ?? []).join("\n")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          assignment: {
                            ...draft.assignment,
                            criteria: e.target.value.split("\n").filter((l) => l.trim()),
                          },
                        })
                      }
                    />
                  </Field>
                </TabsContent>
              </Tabs>

              <div className="sticky bottom-0 mt-10 -mx-5 flex flex-wrap items-center gap-3 border-t bg-background/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
                <Button variant="brand" onClick={() => save(true)} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-1.5 h-4 w-4" />
                  )}
                  Publish to students
                </Button>
                <Button variant="outline" onClick={() => save(false)} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" /> Save draft
                </Button>
                <span className="text-xs text-muted-foreground">
                  {stored?.updated_at
                    ? `Last saved ${new Date(stored.updated_at).toLocaleString()}`
                    : "Not saved yet"}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function fromSources(
  builtIn: CourseModule,
  stored: ReturnType<typeof useModuleOverrides>["rows"][number] | undefined,
): Draft {
  return {
    title: stored?.title ?? builtIn.title,
    summary: stored?.summary ?? builtIn.summary,
    duration: stored?.duration ?? builtIn.duration ?? "",
    lesson: stored?.lesson.length ? stored.lesson : builtIn.lesson,
    quiz: stored?.quiz.length ? stored.quiz : builtIn.quiz,
    notes: stored?.notes ?? builtIn.notes ?? emptyNotes(builtIn.title),
    assignment: stored?.assignment ?? builtIn.assignment ?? emptyAssignment(),
  };
}

function QuizEditor({
  quiz,
  onChange,
}: {
  quiz: QuizQuestion[];
  onChange: (next: QuizQuestion[]) => void;
}) {
  const update = (index: number, question: QuizQuestion) => {
    const next = [...quiz];
    next[index] = question;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="font-mono text-[11px] tracking-[0.12em] uppercase">
          Quiz questions
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange([
              ...quiz,
              {
                id: `q${quiz.length + 1}-${Math.random().toString(36).slice(2, 7)}`,
                question: "",
                options: ["", "", "", ""],
                answerIndex: 0,
              },
            ])
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add question
        </Button>
      </div>

      {quiz.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No quiz yet. Without questions, students can mark the module complete themselves.
        </p>
      ) : null}

      {quiz.map((question, index) => (
        <div key={question.id} className="space-y-3 rounded-md border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              Question {index + 1}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onChange(quiz.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <Textarea
            rows={2}
            value={question.question}
            placeholder="Question text"
            onChange={(e) => update(index, { ...question, question: e.target.value })}
          />
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={question.answerIndex === optionIndex}
                  onChange={() => update(index, { ...question, answerIndex: optionIndex })}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                  aria-label={`Mark option ${optionIndex + 1} as correct`}
                />
                <Input
                  value={option}
                  placeholder={`Option ${optionIndex + 1}`}
                  onChange={(e) => {
                    const options = [...question.options];
                    options[optionIndex] = e.target.value;
                    update(index, { ...question, options });
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const options = question.options.filter((_, i) => i !== optionIndex);
                    update(index, {
                      ...question,
                      options,
                      answerIndex: Math.min(question.answerIndex, Math.max(options.length - 1, 0)),
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => update(index, { ...question, options: [...question.options, ""] })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add option
            </Button>
            <p className="text-xs text-muted-foreground">
              Select the radio button next to the correct answer.
            </p>
          </div>
          <Field label="Explanation shown after answering (optional)">
            <Textarea
              rows={2}
              value={question.explanation ?? ""}
              onChange={(e) => update(index, { ...question, explanation: e.target.value })}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-mono text-[11px] tracking-[0.12em] uppercase">{label}</Label>
      {children}
    </div>
  );
}

function Shell({ children, email }: { children: React.ReactNode; email?: string | undefined }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-16">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mt-10 rounded-lg border bg-card p-8">
          {children}
          {email ? (
            <p className="mt-4 text-xs text-muted-foreground">Signed in as {email}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
