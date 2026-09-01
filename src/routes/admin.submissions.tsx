import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, RefreshCw, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand/Section";
import { cn } from "@/lib/utils";

const TITLE = "Submissions | The VApreneurs School";
const DESCRIPTION =
  "Admin view of course applications and contact messages submitted through The VApreneurs School.";

export const Route = createFileRoute("/admin/submissions")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SubmissionsPage,
});

type Application = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  experience: string | null;
  message: string | null;
  course_title: string | null;
  course_slug: string | null;
  track: string | null;
};

type ContactMessage = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  topic: string;
  message: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SubmissionsPage() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"applications" | "messages">("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    setBusy(true);
    setError(null);
    const [{ data: roles }, apps, msgs] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin"),
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    const admin = Boolean(roles && roles.length > 0);
    setIsAdmin(admin);
    if (admin) {
      if (apps.error || msgs.error) {
        setError("We couldn't load submissions. Please try again.");
      }
      setApplications((apps.data ?? []) as Application[]);
      setMessages((msgs.data ?? []) as ContactMessage[]);
    }
    setBusy(false);
  }

  useEffect(() => {
    if (!loading && user) void load();
    if (!loading && !user) setIsAdmin(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id]);

  if (loading || (user && isAdmin === null)) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Checking your access…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <Gate
          title="Sign in to view submissions"
          text="This page is for school admins only. Sign in with your admin account to continue."
          action={<Button asChild variant="brand"><Link to="/auth">Sign in</Link></Button>}
        />
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <Gate
          title="Admins only"
          text="Your account doesn't have admin access to submissions. If this is your school account, let us know and we'll grant it."
          action={<Button asChild variant="outline"><Link to="/portal">Back to portal</Link></Button>}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Admin · Submissions</Eyebrow>
          <h1 className="mt-2 text-3xl text-primary sm:text-4xl">Applications &amp; messages</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every course application and contact form message submitted on the site. A copy of each
            new submission is also emailed to info@thevapreneursschool.com.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={busy}>
          <RefreshCw className={cn("mr-2 h-4 w-4", busy && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {error ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex gap-2">
        <TabButton active={tab === "applications"} onClick={() => setTab("applications")}>
          Applications ({applications.length})
        </TabButton>
        <TabButton active={tab === "messages"} onClick={() => setTab("messages")}>
          Contact messages ({messages.length})
        </TabButton>
      </div>

      <div className="mt-6 space-y-4">
        {tab === "applications" ? (
          applications.length === 0 ? (
            <Empty text="No applications yet." />
          ) : (
            applications.map((row) => (
              <Card key={row.id}>
                <CardHead
                  title={row.name}
                  email={row.email}
                  date={row.created_at}
                  tag={row.track === "coaching" ? "With coaching" : row.track === "cohort" ? "Accelerator cohort" : "Self-taught"}
                />
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <Field label="Applying for" value={row.course_title ?? row.course_slug ?? "—"} />
                  <Field label="Phone" value={row.phone ?? "—"} />
                  <Field label="Experience" value={row.experience ?? "—"} />
                </dl>
                {row.message ? <Note>{row.message}</Note> : null}
              </Card>
            ))
          )
        ) : messages.length === 0 ? (
          <Empty text="No contact messages yet." />
        ) : (
          messages.map((row) => (
            <Card key={row.id}>
              <CardHead title={row.name} email={row.email} date={row.created_at} tag={row.topic} />
              <Note>{row.message}</Note>
            </Card>
          ))
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-14">{children}</div>;
}

function Gate({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center">
      <ShieldAlert className="mx-auto h-8 w-8 text-accent-deep" />
      <h1 className="mt-4 text-2xl text-primary">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-6 flex justify-center">{action}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground/70 hover:text-accent-deep",
      )}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <article className="rounded-xl border border-border bg-card p-6">{children}</article>;
}

function CardHead({
  title,
  email,
  date,
  tag,
}: {
  title: string;
  email: string;
  date: string;
  tag: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl text-primary">{title}</h2>
        <a
          href={`mailto:${email}`}
          className="mt-1 inline-flex items-center gap-1.5 text-sm text-accent-deep hover:underline"
        >
          <Mail className="h-3.5 w-3.5" />
          {email}
        </a>
      </div>
      <div className="text-right">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-deep">{tag}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatDate(date)}</p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 whitespace-pre-line rounded-md bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-foreground/85">
      {children}
    </p>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
