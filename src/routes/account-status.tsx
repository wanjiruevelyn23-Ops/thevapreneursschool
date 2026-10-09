import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Hourglass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyAccess, type MyAccess } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { StatusShell } from "./verify-email";

const TITLE = "Account status | The VApreneurs School";
const DESCRIPTION = "Check whether your VApreneurs School student account has been approved.";

export const Route = createFileRoute("/account-status")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AccountStatusPage,
});

const COPY: Record<string, { title: string; text: string }> = {
  pending_approval: {
    title: "Your account is awaiting approval",
    text: "Thanks for verifying your email. The school reviews every new account before the student portal opens. You'll be able to sign in to the portal as soon as you're approved.",
  },
  rejected: {
    title: "Your account wasn't approved",
    text: "This account hasn't been approved for the student portal. If you think this is a mistake, email info@thevapreneursschool.com.",
  },
  suspended: {
    title: "Your access is paused",
    text: "Portal access for this account has been suspended. Your progress is saved. Email info@thevapreneursschool.com to resolve it.",
  },
};

function AccountStatusPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [access, setAccess] = useState<MyAccess | null>(null);

  useEffect(() => {
    if (!loading && user) void fetchMyAccess().then(setAccess);
  }, [loading, user]);

  useEffect(() => {
    if (access?.account_status === "approved" && access.email_verified) {
      void navigate({ to: "/portal" });
    }
  }, [access, navigate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (!loading && !user) {
    return (
      <StatusShell>
        <h1 className="text-2xl text-primary">Sign in to check your account</h1>
        <Button asChild variant="brand" className="mt-5">
          <Link to="/auth">Sign in</Link>
        </Button>
      </StatusShell>
    );
  }

  const copy = COPY[access?.account_status ?? "pending_approval"] ?? COPY["pending_approval"]!;
  return (
    <StatusShell>
      <Hourglass className="mx-auto h-9 w-9 text-accent-deep" />
      <h1 className="mt-4 text-2xl text-primary">{copy.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.text}</p>
      {user?.email ? <p className="mt-3 text-xs text-muted-foreground">Signed in as {user.email}</p> : null}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button variant="brand" onClick={() => void fetchMyAccess().then(setAccess)}>
          Check again
        </Button>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    </StatusShell>
  );
}
