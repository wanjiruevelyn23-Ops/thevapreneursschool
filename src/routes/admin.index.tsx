import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, PenSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Eyebrow } from "@/components/brand/Section";

const TITLE = "Instructor Dashboard | The VApreneurs School";
const DESCRIPTION =
  "Private instructor workspace for The VApreneurs School: publish module content and read student submissions.";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/">
          <Logo />
        </Link>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        ) : !user ? (
          <Card>
            <h1 className="text-2xl text-primary">Instructor sign-in required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your instructor account to reach this workspace.
            </p>
            <Button asChild variant="brand" className="mt-4">
              <Link to="/auth">Sign in</Link>
            </Button>
          </Card>
        ) : !isAdmin ? (
          <Card>
            <h1 className="text-2xl text-primary">Instructors only</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This account doesn't have instructor access.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/portal">Go to the student portal</Link>
            </Button>
          </Card>
        ) : (
          <>
            <Eyebrow className="mt-10">Instructor workspace</Eyebrow>
            <h1 className="mt-3 text-3xl text-primary">Welcome back, instructor</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This area is separate from the student portal — students never see these tools.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Tile
                to="/admin/instructor"
                icon={<PenSquare className="h-5 w-5 text-accent" />}
                title="Instructor Studio"
                text="Write and publish module notes, lessons, quizzes and assignments."
              />
              <Tile
                to="/admin/submissions"
                icon={<Inbox className="h-5 w-5 text-accent" />}
                title="Submissions"
                text="Read course applications and contact messages."
              />
            </div>
            <p className="mt-8 text-xs text-muted-foreground">Signed in as {user.email}</p>
          </>
        )}
      </div>
    </div>
  );
}

function Tile({
  to,
  icon,
  title,
  text,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-lg border bg-card p-6 transition-colors hover:border-accent"
    >
      {icon}
      <h2 className="mt-3 text-lg text-primary">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Link>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 rounded-lg border bg-card p-8">{children}</div>;
}
