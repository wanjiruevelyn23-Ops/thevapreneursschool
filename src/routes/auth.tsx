import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { Eyebrow } from "@/components/brand/Section";

const TITLE = "Student sign in | The VApreneurs School";
const DESCRIPTION =
  "Sign in or create your student account to access The VApreneurs School portal, modules and progress.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/portal" });
  }, [loading, user, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/portal`,
        },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. You're signed in.");
      navigate({ to: "/portal" });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/portal" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-5 py-14">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block">
          <Logo tone="light" />
        </Link>
        <div className="surface-card p-7">
          <Eyebrow>Student portal</Eyebrow>
          <h1 className="mt-3 text-2xl text-primary">
            {mode === "signin" ? "Sign in to continue" : "Create your student account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your portal unlocks once you're enrolled in a course or the Accelerator.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">Full name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Amina Otieno"
                />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-primary">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-primary">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
              />
            </div>
            <Button type="submit" variant="brand" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-accent-deep underline underline-offset-4"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
        <p className="mt-5 text-center text-xs text-primary-foreground/60">
          <Link to="/" className="underline underline-offset-4">
            Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
