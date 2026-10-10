import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Account = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  email_verified: boolean;
  account_status: string;
  provider: string;
  roles: string[];
  last_sign_in_at: string | null;
};

const LABEL: Record<string, string> = {
  pending_approval: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

/** Admin-only account approval. The database rejects these actions for non-admins. */
export function AccountsPanel() {
  const [rows, setRows] = useState<Account[]>([]);
  const [filter, setFilter] = useState("pending_approval");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.rpc("admin_users");
    if (error) {
      toast.error("Couldn't load accounts.");
      return;
    }
    setRows((data ?? []) as unknown as Account[]);
  }
  useEffect(() => {
    void load();
  }, []);

  async function setStatus(id: string, account_status: string) {
    setBusy(id);
    const { error } = await supabase.from("profiles").update({ account_status }).eq("id", id);
    setBusy(null);
    if (error) return void toast.error(error.message);
    toast.success(`Account ${(LABEL[account_status] ?? account_status).toLowerCase()}.`);
    void load();
  }

  async function toggleInstructor(a: Account) {
    setBusy(a.id);
    const has = a.roles.includes("instructor");
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", a.id).eq("role", "instructor")
      : await supabase.from("user_roles").insert({ user_id: a.id, role: "instructor" });
    setBusy(null);
    if (error) return void toast.error(error.message);
    toast.success(has ? "Instructor role removed." : "Instructor role granted.");
    void load();
  }

  const shown = filter === "all" ? rows : rows.filter((r) => r.account_status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["pending_approval", "approved", "suspended", "rejected", "all"].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "brand" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : LABEL[f]} (
            {f === "all" ? rows.length : rows.filter((r) => r.account_status === f).length})
          </Button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          No accounts here.
        </p>
      ) : (
        shown.map((a) => (
          <article key={a.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-primary">
                  {a.full_name || a.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {a.email} · signed up {new Date(a.created_at).toLocaleDateString()} via{" "}
                  {a.provider}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Email {a.email_verified ? "verified" : "not verified yet"}
                  {a.roles.length ? ` · Roles: ${a.roles.join(", ")}` : ""}
                </p>
              </div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">
                {LABEL[a.account_status] ?? a.account_status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.account_status !== "approved" && (
                <Button size="sm" variant="brand" disabled={busy === a.id} onClick={() => void setStatus(a.id, "approved")}>
                  Approve
                </Button>
              )}
              {a.account_status === "pending_approval" && (
                <Button size="sm" variant="outline" disabled={busy === a.id} onClick={() => void setStatus(a.id, "rejected")}>
                  Reject
                </Button>
              )}
              {a.account_status === "approved" && !a.roles.includes("admin") && (
                <Button size="sm" variant="outline" disabled={busy === a.id} onClick={() => void setStatus(a.id, "suspended")}>
                  Suspend
                </Button>
              )}
              {!a.roles.includes("admin") && (
                <Button size="sm" variant="ghost" disabled={busy === a.id} onClick={() => void toggleInstructor(a)}>
                  {a.roles.includes("instructor") ? "Remove instructor" : "Make instructor"}
                </Button>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
