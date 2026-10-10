import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Sub = {
  id: string;
  course_slug: string;
  module_slug: string;
  response: string | null;
  file_name: string | null;
  status: string;
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
};

/** Student hands in an assignment and later reads released grade + feedback. */
export function AssignmentSubmit({
  userId,
  courseSlug,
  moduleSlug,
}: {
  userId: string;
  courseSlug: string;
  moduleSlug: string;
}) {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.rpc("my_submissions");
    setSubs(
      ((data ?? []) as Sub[]).filter(
        (s) => s.course_slug === courseSlug && s.module_slug === moduleSlug,
      ),
    );
  }
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, moduleSlug]);

  async function submit() {
    if (!text.trim() && !file) return void toast.error("Add a written answer or attach a file.");
    if (file && file.size > 20 * 1024 * 1024) return void toast.error("Files must be under 20 MB.");
    setBusy(true);
    let file_path: string | null = null;
    if (file) {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      file_path = `${userId}/${courseSlug}/${moduleSlug}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from("submissions").upload(file_path, file);
      if (error) {
        setBusy(false);
        return void toast.error("Upload failed. Please try again.");
      }
    }
    const { error } = await supabase.from("assignment_submissions").insert({
      user_id: userId,
      course_slug: courseSlug,
      module_slug: moduleSlug,
      response: text.trim() || null,
      file_path,
      file_name: file?.name ?? null,
    });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Assignment submitted. Your instructor will review it.");
    setText("");
    setFile(null);
    void load();
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="eyebrow text-accent-deep">Hand in your work</p>
      <Textarea
        className="mt-3 min-h-32"
        placeholder="Write your answer or add a note for your instructor…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={10000}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="file"
          className="text-sm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button variant="brand" disabled={busy} onClick={() => void submit()}>
          {busy ? "Submitting…" : "Submit assignment"}
        </Button>
      </div>

      {subs.length ? (
        <div className="mt-6 space-y-3">
          <p className="eyebrow text-accent-deep">Your submissions</p>
          {subs.map((s) => (
            <div key={s.id} className="rounded-md border border-border bg-secondary/40 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-muted-foreground">
                  {new Date(s.submitted_at).toLocaleString()}
                  {s.file_name ? ` · ${s.file_name}` : ""}
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">
                  {s.grade || s.feedback ? "Reviewed" : "Awaiting review"}
                </span>
              </div>
              {s.grade ? <p className="mt-2 font-semibold text-primary">Grade: {s.grade}</p> : null}
              {s.feedback ? (
                <p className="mt-1 whitespace-pre-line text-foreground/85">{s.feedback}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
