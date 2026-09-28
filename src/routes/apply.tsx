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
    // 1. Keep saving the application to your database records safely
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

    // 2. Send application details straight to Formspree for your school inbox!
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
      } catch (formspreeError) {
        console.error("Formspree forward failed", formspreeError);
      }
    }

    // Signed-in applicants are enrolled immediately so the portal unlocks.
    if (!error && user && !isAccelerator) {
      try {
        await enroll.mutateAsync({ courseSlug, track });
      } catch {
        // Enrolment can be completed later from the portal.
      }
    }

    setSubmitting(false);
    if (error) {
      toast.error("We couldn't submit that. Please try again.");
      return;
    }
    
    // 🎉 IMMEDIATE USER FEEDBACK: Show the confirmation layout instantly!
    setSubmitted(true);
    toast.success("Application received successfully.");
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
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={values.name}
                maxLength={100}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                placeholder="Amina Otieno"
              />
              {errors["name"] && <p className="text-xs font-medium text-destructive">{errors["name"]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={values.email}
                maxLength={255}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="you@email.com"
              />
              {errors["email"] && <p className="text-xs font-medium text-destructive">{errors["email"]}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Phone / WhatsApp</Label>
              <Input
                value={values.phone}
                maxLength={30}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                placeholder="+254 700 000 000"
              />
              {errors["phone"] && <p className="text-xs font-medium text-destructive">{errors["phone"]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Experience level</Label>
              <select
                value={values.experience}
                onChange={(e) => setValues((v) => ({ ...v, experience: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Choose an option…</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors["experience"] && <p className="text-xs font-medium text-destructive">{errors["experience"]}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Message (Optional)</Label>
            <Textarea
              rows={5}
              value={values.message}
              maxLength={1500}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              placeholder="Tell us about your background or any specific questions you have."
            />
            {errors["message"] && <p className="text-xs font-medium text-destructive">{errors["message"]}</p>}
          </div>

          <Button type="submit" variant="brand" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Application"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="surface-card p-6">
            <Eyebrow>Selected Track</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold text-primary">{selectionTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAccelerator 
                ? "10 days of intensive live bootcamp tracking client acquisition, contract assembly, and professional portfolio positioning matrices alongside an exclusive peer cohort environment."
                : `Tuition program mapped to your choice of learning pathways (${track === "coaching" ? "1-on-1 expert coaching review track" : "independent self-paced study layout"}).`
              }
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}

    

