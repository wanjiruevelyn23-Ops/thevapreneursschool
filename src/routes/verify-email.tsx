import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";

const TITLE = "Verify your email | The VApreneurs School";
const DESCRIPTION = "Confirm your email address to continue to The VApreneurs School student portal.";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function resend() {
    const target = user?.email ?? email.trim();
    if (!target) {
      toast.error("Enter the email you signed up with.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: target,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Verification email sent. Check your inbox and spam folder.");
  }

  return (
    <StatusShell>
      <MailCheck className="mx-auto h-9 w-9 text-accent-deep" />
      <h1 className="mt-4 text-2xl text-primary">Verify your email address</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We sent a confirmation link to {user?.email ?? "your email"}. Click it to prove the address is
        yours, then sign in. After that, the school reviews and approves your account before the
        portal opens.
      </p>
      {!user?.email ? (
        <Input
          className="mt-5"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      ) : null}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button variant="brand" disabled={busy} onClick={() => void resend()}>
          {busy ? "Sending…" : "Resend verification email"}
        </Button>
        <Button asChild variant="outline">
          <Link to="/auth">Back to sign in</Link>
        </Button>
      </div>
    </StatusShell>
  );
}

export function StatusShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-5 py-14">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block">
          <Logo tone="light" />
        </Link>
        <div className="surface-card p-7 text-center">{children}</div>
      </div>
    </div>
  );
}
