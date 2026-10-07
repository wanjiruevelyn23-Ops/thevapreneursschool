import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { COURSES } from "@/content/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Row = {
  id: string;
  user_id: string;
  course_slug: string;
  track: string;
  enrollment_status: string;
  payment_status: string;
  access_status: string;
  created_at: string;
};
type Profile = { id: string; email: string | null; full_name: string | null };

const STATUSES = ["pending", "approved", "active", "suspended", "completed", "cancelled"];
const PAYMENTS = ["unpaid", "paid", "waived"];

/** Admin-only: create and manage student enrolments. RLS rejects non-admins. */
export function EnrollmentsPanel({ prefill }: { prefill?: { email: string; course: string } | null }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState(COURSES[0]?.slug ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefill) {
      setEmail(prefill.email);
      if (COURSES.some((c) => c.slug === prefill.course)) setCourse(prefill.course);
    }
  }, [prefill]);

  async function load() {
    const [{ data: e }, { data: p }] = await Promise.all([
      supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, full_name"),
    ]);
    setRows((e ?? []) as Row[]);
    setProfiles(new Map(((p ?? []) as Profile[]).map((x) => [x.id, x])));
  }
  useEffect(() => {
    void load();
  }, []);

  async function create() {
    setBusy(true);
    const target = [...profiles.values()].find(
      (p) => p.email?.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!target) {
      setBusy(false);
      toast.error("No account with that email yet. Ask the student to create an account first.");
      return;
    }
    const { error } = await supabase
      .from("enrollments")
      .upsert(
        { user_id: target.id, course_slug: course, enrollment_status: "approved" },
        { onConflict: "user_id,course_slug" },
      );
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Enrolment approved. Mark it paid and active to unlock content.");
    setEmail("");
    void load();
  }

  async function update(id: string, patch: Partial<Row>) {
    const { error } = await supabase.from("enrollments").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Enrolment updated.");
    void load();
  }

  const select =
    "rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl text-primary">Approve a student</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The student must have created an account with this email. Content unlocks only when the
          status is Active.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input
            className="max-w-xs"
            placeholder="student@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select className={select} value={course} onChange={(e) => setCourse(e.target.value)}>
            {COURSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <Button variant="brand" disabled={busy || !email} onClick={() => void create()}>
            Approve
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          No enrolments yet.
        </p>
      ) : (
        rows.map((row) => {
          const p = profiles.get(row.user_id);
          const title = COURSES.find((c) => c.slug === row.course_slug)?.title ?? row.course_slug;
          return (
            <article key={row.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-primary">
                    {p?.full_name || p?.email || row.user_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p?.email} · {title}
                  </p>
                </div>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">
                  Access {row.access_status === "active" ? "open" : "locked"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                  Status
                  <select
                    className={select}
                    value={row.enrollment_status}
                    onChange={(e) => void update(row.id, { enrollment_status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  Payment
                  <select
                    className={select}
                    value={row.payment_status}
                    onChange={(e) => void update(row.id, { payment_status: e.target.value })}
                  >
                    {PAYMENTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
