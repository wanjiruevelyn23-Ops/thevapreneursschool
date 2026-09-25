import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { notifyApplication } from "@/lib/notify.functions";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEnroll } from "@/lib/lms";
import { COURSES, getCourse, ACCELERATOR } from "@/content/courses";
import type { TrackKey } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eyebrow } from "@/components/brand/Section";

const TITLE = "Apply | The VApreneurs School";
const DESCRIPTION =
  "Apply for a VA skill track, a Sustain Toolkit course, or the 10-day Accelerator Cohort 1 at The VApreneurs School.";

const EXPERIENCE_LEVELS = [
  "Complete beginner",
  "Some experience, no paying clients yet",
  "1–2 paying clients",
  "Working VA, want to scale",
] as const;

const applySchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a reachable phone number").max(30),
  experience: z.string().min(1, "Choose your experience level"),
  message: z.string().trim().max(1500).optional(),
});

export const Route = createFileRoute("/apply")({
  validateSearch: z.object({
    course: z.string().optional(),
    track: z.enum(["self", "coaching"]).optional(),
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const enroll = useEnroll(user?.id);
  const sendNotification = useServerFn(notifyApplication);

  const courseSlug = search.course ?? "";
  const isAccelerator = courseSlug === ACCELERATOR.slug;
  const course = getCourse(courseSlug);
  const track: TrackKey = search.track ?? "self";
  const selectionTitle = isAccelerator
    ? `${ACCELERATOR.title} — ${ACCELERATOR.cohort}`
    : (course?.title ?? "Not selected yet");

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
   async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!courseSlug) {
      toast.error("Choose what you're applying for first.");
      return;
    }
    const parsed = applySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path)] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // 1. Save application data to your database records safely
    const { error } = await supabase.from("applications").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      experience: parsed.data.experience,
      message: parsed.data.message ?? null,
      course_slug: courseSlug,
      course_title: selectionTitle,
      track: isAccelerator ? "cohort" : track,
    });

    // 2. Dispatch application profiles out to your Formspree backend dashboard repository channel
    if (!error) {
      try {
        await fetch("https://formspree.io", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Form: "School Application Form",
            Name: parsed.data.name,
            Email: parsed.data.email,
            Phone: parsed.data.phone,
            Experience: parsed.data.experience,
            Message: parsed.data.message ?? "No additional message",
            Applied_For: selectionTitle,
            Track: isAccelerator ? "cohort" : track
          })
        });

               // 🇰🇪 INITIALIZE AUTOMATED INTASEND Accepts: M-Pesa STK Push natively!
        // @ts-ignore
        const intasendInstance = new IntaSend({
          publicAPIKey: "ISPubKey_test_91ffc81a-8ac4-419e-8008-7091caa8d73f",
          live: false
        });

        intasendInstance.on("COMPLETE", (results: any) => {
          console.log("IntaSend payment integration success:", results);
          toast.success("Payment verified successfully!");
          setSubmitted(true);
        })
        .on("FAILED", (results: any) => {
          console.error("IntaSend interface transaction exception:", results);
          toast.error("Payment authorization incomplete. Please check your balance and retry.");
          setSubmitting(false);
        });
        
        const cleanPhone = parsed.data.phone.replace(/[\s+]/g, "");
        const nameParts = parsed.data.name.trim().split(" ");

        // @ts-ignore
        intasendInstance.launch({
          amount: 3999,
          currency: "KES",
          email: parsed.data.email,
          phone_number: cleanPhone,
          first_name: nameParts[0] || "Student",
          last_name: nameParts[1] || "Enrolled",
          api_ref: "ACCELERATOR-COHORT-1"
        });
        } else {
          // Absolute system fallback script tracker routing strategy
          toast.success("Form submitted! Routing secure payment link gateway interface...");
          window.location.href = `https://intasend.com{encodeURIComponent(parsed.data.email)}`;
        }

      } catch (formspreeError) {
        console.error("Formspree data forward exception:", formspreeError);
        setSubmitting(false);
      }
    } else {
      setSubmitting(false);
      toast.error("We couldn't submit that application. Please check fields and try again.");
    }
  }
    // 🔐 SECURE PORTAL TIMELINE GATEWAY
    const now = new Date();
    const cohortLaunchDate = new Date("2026-10-28T00:00:00"); // ⏱️ Absolute lock down until October 28th at 12:00 AM midnight EAT

    if (!error && user && !isAccelerator) {
      try {
        // Safe logger placeholder - general course access requires payment completion above
        console.log("Awaiting payment verification callback processing configuration pipeline.");
      } catch {
        // Fallback logger
      }
    } else if (isAccelerator && now < cohortLaunchDate) {
      console.log("Access status: Locked. Accelerator Cohort 1 contents scheduled release sequence: 12:00 AM Midnight.");
    }

    setSubmitting(false);
    if (error) {
      toast.error("We couldn't submit that. Please try again.");
      return;
    }
       setSubmitting(false);
    if (error) {
      toast.error("We couldn't submit that. Please try again.");
      return;
    }
    // 😉 Clean space here! The submission screen now waits patiently for the checkout success payload callback.
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-6 text-3xl text-primary">Application received</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You applied for <strong className="text-foreground">{selectionTitle}</strong>
          {!isAccelerator ? ` (${track === "coaching" ? "with coaching" : "self-taught"})` : ""}.
          We'll email you next steps within 1 business day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand">
            <Link to="/portal">Go to the student portal</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">Browse more courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Eyebrow className="text-accent">Application</Eyebrow>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            One form. One clear next step.
          </h1>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="surface-card space-y-5 p-7" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors["name"]}>
              <Input
                value={values.name}
                maxLength={100}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                placeholder="Amina Otieno"
              />
            </Field>
            <Field label="Email" error={errors["email"]}>
              <Input
                type="email"
                value={values.email}
                maxLength={255}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="you@email.com"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone / WhatsApp" error={errors["phone"]}>
              <Input
                value={values.phone}
                maxLength={30}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                placeholder="+254 700 000 000"
              />
            </Field>
            <Field label="Experience level" error={errors["experience"]}>
              <select
                value={values.experience}
                onChange={(e) => setValues((v) => ({ ...v, experience: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Choose one…</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Anything we should know? (optional)" error={errors["message"]}>
            <Textarea
              rows={5}
              value={values.message}
              maxLength={1500}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              placeholder="Where you are now, and what you want this course to change."
            />
          </Field>

          <Button type="submit" variant="brand" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <Eyebrow>You're applying for</Eyebrow>
            <p className="mt-3 font-display text-xl font-semibold text-primary">
              {selectionTitle}
            </p>
            {isAccelerator ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {ACCELERATOR.length} · {ACCELERATOR.format}. Prerequisite:{" "}
                {ACCELERATOR.prerequisite.toLowerCase()}.
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Track:{" "}
                <span className="font-medium text-accent-deep">
                  {track === "coaching" ? "With added coaching" : "Self-taught"}
                </span>
              </p>
            )}

            <div className="mt-5 space-y-3 border-t border-border pt-5">
              <Label className="text-sm font-medium text-primary">
                Change your selection
              </Label>
              <select
                value={courseSlug}
                onChange={(e) =>
                  navigate({
                    to: "/apply",
                    search: {
                      course: e.target.value || undefined,
                      track: e.target.value === ACCELERATOR.slug ? undefined : track,
                    },
                  })
                }
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
              >
                <option value="">Choose a course…</option>
                <option value={ACCELERATOR.slug}>
                  {ACCELERATOR.title} ({ACCELERATOR.cohort})
                </option>
                {COURSES.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </select>

              {course ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={track === "self" ? "brand" : "outline"}
                    onClick={() =>
                      navigate({ to: "/apply", search: { course: courseSlug, track: "self" } })
                    }
                  >
                    Self-taught
                  </Button>
                  {course.coaching ? (
                    <Button
                      type="button"
                      size="sm"
                      variant={track === "coaching" ? "brand" : "outline"}
                      onClick={() =>
                        navigate({
                          to: "/apply",
                          search: { course: courseSlug, track: "coaching" },
                        })
                      }
                    >
                      With coaching
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-accent/30 bg-mint/70 p-6 text-sm leading-relaxed text-primary">
            {user ? (
              <>
                Signed in as{" "}
                <strong className="font-medium">{user.email}</strong>. Submitting
                this form enrols you and unlocks the course in your student portal.
              </>
            ) : (
              <>
                Already applied?{" "}
                <Link to="/auth" className="font-medium underline underline-offset-4">
                  Sign in
                </Link>{" "}
                to unlock your student portal and track progress.
              </>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-primary">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
