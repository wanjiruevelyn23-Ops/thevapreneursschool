import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ACCELERATOR_LMS_COURSE } from "@/content/courses";
import { resendCompletionEmail } from "@/lib/completion.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const COURSE = ACCELERATOR_LMS_COURSE;
type Filter = "all" | "progress" | "completed" | "review" | "none";

type Data = {
  students: { id: string; email: string | null; full_name: string | null }[];
  progress: { user_id: string; module_slug: string; completed: boolean; last_accessed: string | null; score: number | null; total: number | null }[];
  attempts: { user_id: string; module_slug: string }[];
  subs: { user_id: string; module_slug: string; status: string }[];
  completions: { user_id: string; completed_at: string; email_status: string | null }[];
  feedback: Set<string>;
};

/** Admin-only view of every active Accelerator student's ten-day progress. */
export function ProgressPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const resend = useServerFn(resendCompletionEmail);

  async function load() {
    const slug = COURSE.slug;
    const { data: enr } = await supabase.from("enrollments").select("user_id")
      .eq("course_slug", slug).eq("access_status", "active");
    const ids = (enr ?? []).map((e) => e.user_id);
    if (ids.length === 0) return setData({ students: [], progress: [], attempts: [], subs: [], completions: [], feedback: new Set() });
    const [p, pr, qa, s, c, f] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name").in("id", ids),
      supabase.from("module_progress").select("user_id, module_slug, completed, last_accessed, score, total").eq("course_slug", slug).in("user_id", ids),
      supabase.from("quiz_attempts").select("user_id, module_slug").eq("course_slug", slug).in("user_id", ids),
      supabase.from("assignment_submissions").select("user_id, module_slug, status").eq("course_slug", slug).in("user_id", ids),
      supabase.from("course_completions").select("user_id, completed_at, email_status").eq("course_slug", slug),
      supabase.from("course_feedback").select("user_id").eq("course_slug", slug),
    ]);
    setData({
      students: p.data ?? [], progress: pr.data ?? [], attempts: qa.data ?? [], subs: s.data ?? [],
      completions: c.data ?? [], feedback: new Set((f.data ?? []).map((x) => x.user_id)),
    });
  }
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.students.map((st) => {
      const prog = data.progress.filter((r) => r.user_id === st.id);
      const done = prog.filter((r) => r.completed).length;
      const last = prog.map((r) => r.last_accessed).filter(Boolean).sort().at(-1) ?? null;
      const toReview = data.subs.filter((r) => r.user_id === st.id && r.status === "submitted").length;
      const completion = data.completions.find((c) => c.user_id === st.id);
      const status: Filter = completion ? "completed" : prog.length === 0 ? "none" : "progress";
      return { st, prog, done, last, toReview, completion, status };
    });
  }, [data]);

  const term = search.trim().toLowerCase();
  const shown = rows.filter((r) =>
    (filter === "all" || (filter === "review" ? r.toReview > 0 : r.status === filter)) &&
    (!term || `${r.st.full_name ?? ""} ${r.st.email ?? ""}`.toLowerCase().includes(term)));

  const total = COURSE.modules.length;
  const FILTERS: [Filter, string][] = [["all", "All"], ["progress", "In progress"], ["completed", "Completed"], ["review", "Needs assignment review"], ["none", "Not started"]];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{COURSE.title} · students with an active place</p>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map(([k, label]) => (
          <Button key={k} size="sm" variant={filter === k ? "brand" : "outline"} onClick={() => setFilter(k)}>
            {label} ({k === "all" ? rows.length : rows.filter((r) => (k === "review" ? r.toReview > 0 : r.status === k)).length})
          </Button>
        ))}
        <Input className="max-w-xs" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {!data ? <p className="text-sm text-muted-foreground">Loading…</p> : shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          No students here. Students appear once their Accelerator place is set to Active on the Enrolments tab.
        </p>
      ) : shown.map((r) => (
        <article key={r.st.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold text-primary">{r.st.full_name || r.st.email}</p>
              <p className="text-sm text-muted-foreground">{r.st.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last lesson opened: {r.last ? new Date(r.last).toLocaleString() : "never"}
                {r.toReview ? ` · ${r.toReview} assignment(s) to review` : ""}
              </p>
            </div>
            <div className="min-w-40 text-right">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">
                {r.done}/{total} days · {Math.round((r.done / total) * 100)}%
              </p>
              <Progress value={(r.done / total) * 100} className="mt-2 h-2" />
              {r.completion ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Completed {new Date(r.completion.completed_at).toLocaleDateString()} · Email{" "}
                  {r.completion.email_status === "sent" ? "sent" : r.completion.email_status === "failed" ? "failed" : "pending"} ·
                  Feedback {data.feedback.has(r.st.id) ? "received" : "not yet"}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setOpen(open === r.st.id ? null : r.st.id)}>
              {open === r.st.id ? "Hide days" : "View all 10 days"}
            </Button>
            {r.completion ? (
              <Button size="sm" variant="outline" onClick={async () => {
                const res = await resend({ data: { userId: r.st.id } });
                if (res.sent) toast.success("Completion email sent."); else toast.error("The email couldn't be sent.");
                void load();
              }}>Resend completion email</Button>
            ) : null}
          </div>
          {open === r.st.id ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground">
                  <th className="py-1 pr-3">Day</th><th className="pr-3">Quiz</th><th className="pr-3">Attempts</th><th className="pr-3">Assignment</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {COURSE.modules.map((m) => {
                    const p = r.prog.find((x) => x.module_slug === m.slug);
                    const att = data.attempts.filter((a) => a.user_id === r.st.id && a.module_slug === m.slug).length;
                    const sub = data.subs.find((s) => s.user_id === r.st.id && s.module_slug === m.slug);
                    return (
                      <tr key={m.slug} className="border-t border-border">
                        <td className="py-2 pr-3">Day {m.number}: {m.title}</td>
                        <td className="pr-3">{p?.total ? `${Math.round(((p.score ?? 0) / p.total) * 100)}% (${p.score}/${p.total})` : "—"}</td>
                        <td className="pr-3">{att || "—"}</td>
                        <td className="pr-3">{sub ? (sub.status === "reviewed" ? "Reviewed" : "Submitted") : "—"}</td>
                        <td>{p?.completed ? "Completed" : p ? "Opened" : "Not started"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

/** Admin-only list of private student feedback. */
export function FeedbackPanel() {
  const [rows, setRows] = useState<{ id: string; user_id: string; course_slug: string; rating: number; most_useful: string | null; improve: string | null; comments: string | null; created_at: string }[]>([]);
  const [people, setPeople] = useState<Map<string, string>>(new Map());
  const [min, setMin] = useState(0);
  useEffect(() => {
    void (async () => {
      const [f, p] = await Promise.all([
        supabase.from("course_feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, email, full_name"),
      ]);
      setRows(f.data ?? []);
      setPeople(new Map((p.data ?? []).map((x) => [x.id, x.full_name || x.email || "Student"])));
    })();
  }, []);
  const shown = rows.filter((r) => r.rating >= min);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[0, 4, 5].map((n) => (
          <Button key={n} size="sm" variant={min === n ? "brand" : "outline"} onClick={() => setMin(n)}>
            {n === 0 ? "All ratings" : n === 5 ? "5 stars" : "4+ stars"}
          </Button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">No feedback yet.</p>
      ) : shown.map((r) => (
        <article key={r.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-display font-semibold text-primary">{people.get(r.user_id) ?? "Student"}</p>
            <p className="text-sm text-accent-deep">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} · {new Date(r.created_at).toLocaleDateString()}</p>
          </div>
          <p className="text-xs text-muted-foreground">{r.course_slug === "accelerator" ? "The Accelerator" : r.course_slug}</p>
          {[["Most useful", r.most_useful], ["Could improve", r.improve], ["Other comments", r.comments]].map(([l, v]) => v ? (
            <p key={l} className="mt-3 text-sm"><span className="font-semibold text-primary">{l}: </span>{v}</p>
          ) : null)}
        </article>
      ))}
    </div>
  );
}
