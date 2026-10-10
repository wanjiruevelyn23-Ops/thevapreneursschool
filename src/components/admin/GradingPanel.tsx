import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { COURSES } from "@/content/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Row = {
  id: string;
  user_id: string;
  course_slug: string;
  module_slug: string;
  response: string | null;
  file_path: string | null;
  file_name: string | null;
  status: string;
  grade: string | null;
  feedback: string | null;
  feedback_released: boolean;
  submitted_at: string;
};
type Profile = { id: string; email: string | null; full_name: string | null };

/** Instructor review of student assignment submissions. */
export function GradingPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [filter, setFilter] = useState<"submitted" | "reviewed" | "all">("submitted");

  async function load() {
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from("assignment_submissions").select("*").order("submitted_at", { ascending: false }),
      supabase.from("profiles").select("id, email, full_name"),
    ]);
    setRows((s ?? []) as Row[]);
    setProfiles(new Map(((p ?? []) as Profile[]).map((x) => [x.id, x])));
  }
  useEffect(() => {
    void load();
  }, []);

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["submitted", "reviewed", "all"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "brand" : "outline"} onClick={() => setFilter(f)}>
            {f === "submitted" ? "To review" : f === "reviewed" ? "Reviewed" : "All"} (
            {f === "all" ? rows.length : rows.filter((r) => r.status === f).length})
          </Button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          No assignments here.
        </p>
      ) : (
        shown.map((r) => <Item key={r.id} row={r} profile={profiles.get(r.user_id)} onSaved={load} />)
      )}
    </div>
  );
}

function Item({ row, profile, onSaved }: { row: Row; profile?: Profile; onSaved: () => void }) {
  const [grade, setGrade] = useState(row.grade ?? "");
  const [feedback, setFeedback] = useState(row.feedback ?? "");
  const [busy, setBusy] = useState(false);
  const course = COURSES.find((c) => c.slug === row.course_slug);
  const mod = course?.modules.find((m) => m.slug === row.module_slug);

  async function open() {
    if (!row.file_path) return;
    const { data } = await supabase.storage.from("submissions").createSignedUrl(row.file_path, 600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
    else toast.error("Couldn't open the file.");
  }

  async function save(release: boolean) {
    setBusy(true);
    const { error } = await supabase
      .from("assignment_submissions")
      .update({ grade: grade || null, feedback: feedback || null, feedback_released: release })
      .eq("id", row.id);
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success(release ? "Feedback sent to the student." : "Review saved (not visible to student yet).");
    onSaved();
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-primary">
            {profile?.full_name || profile?.email || "Student"}
          </p>
          <p className="text-sm text-muted-foreground">
            {course?.title ?? row.course_slug} · {mod ? `Module ${mod.number}: ${mod.title}` : row.module_slug}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">
            {row.feedback_released ? "Feedback sent" : row.status === "reviewed" ? "Draft review" : "To review"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{new Date(row.submitted_at).toLocaleString()}</p>
        </div>
      </div>
      {row.response ? (
        <p className="mt-4 whitespace-pre-line rounded-md bg-secondary/60 px-4 py-3 text-sm text-foreground/85">
          {row.response}
        </p>
      ) : null}
      {row.file_path ? (
        <Button size="sm" variant="outline" className="mt-3" onClick={() => void open()}>
          Open {row.file_name ?? "file"}
        </Button>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr]">
        <Input placeholder="Grade e.g. 8/10" value={grade} onChange={(e) => setGrade(e.target.value)} />
        <Textarea placeholder="Feedback for the student" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void save(false)}>
          Save draft
        </Button>
        <Button size="sm" variant="brand" disabled={busy} onClick={() => void save(true)}>
          Send feedback to student
        </Button>
      </div>
    </article>
  );
}
