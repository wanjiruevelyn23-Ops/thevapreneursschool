import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";

const TITLE = "Reset your password | The VApreneurs School";
const DESCRIPTION = "Choose a new password for your VApreneurs School student account.";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    if (window.location.hash.includes("type=recovery")) setReady(true);
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/portal" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-5 py-14">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block">
          <Logo tone="light" />
        </Link>
        <div className="surface-card p-7">
          <h1 className="text-2xl text-primary">Choose a new password</h1>
          {ready ? (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">New password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" variant="brand" className="w-full" disabled={busy}>
                {busy ? "Saving…" : "Save new password"}
              </Button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Open this page from the reset link in your email. Need a new link?{" "}
              <Link to="/auth" className="text-accent-deep underline underline-offset-4">
                Go to sign in
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
