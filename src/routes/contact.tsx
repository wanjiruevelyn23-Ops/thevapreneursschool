import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Clock, Linkedin, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eyebrow } from "@/components/brand/Section";

const TITLE = "Contact The VApreneurs School";
const DESCRIPTION =
  "Questions about a skill track, applying to Cohort 1, booking a Pick My Brain session or partnerships — talk to The VApreneurs School.";

const TOPICS = [
  { value: "cohort-1", label: "Applying to Cohort 1" },
  { value: "skill-track", label: "Question about a skill track" },
  { value: "pick-my-brain", label: "Pick My Brain Session (1-hour consultation)" },
  { value: "partnerships", label: "Partnerships" },
  { value: "other", label: "Something else" },
] as const;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  topic: z.string().min(1, "Please choose a topic"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Please keep it under 2000 characters"),
});

// 🟩 MOVING THIS OUTSIDE FIXES THE CURSOR LOSING FOCUS BUG PERFECTLY!
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs font-medium text-destructive">{error}</p>}
  </div>
);

export const Route = createFileRoute("/contact")({
  validateSearch: z.object({ topic: z.string().optional() }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { topic: presetTopic } = Route.useSearch();
  const [values, setValues] = useState({
    name: "",
    email: "",
    topic: presetTopic && TOPICS.some((t) => t.value === presetTopic) ? presetTopic : "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);
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
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      topic: parsed.data.topic,
      message: parsed.data.message,
    });

    // Forward the general contact message straight to Formspree endpoint
    if (!error) {
      try {
        const topicLabel = TOPICS.find((t) => t.value === parsed.data.topic)?.label || parsed.data.topic;
        await fetch("https://formspree.io/f/xnpnzgzb", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Form: "General Website Contact Form",
            Name: parsed.data.name,
            Email: parsed.data.email,
            Topic: topicLabel,
            Message: parsed.data.message
          })
        });
      } catch (formspreeError) {
        console.error("Formspree forward failed", formspreeError);
      }
    }

    setSubmitting(false);
    if (error) {
      toast.error("We couldn't send that. Please try again.");
      return;
    }
    toast.success("Message sent — we'll reply within 1 business day.");
    setValues({ name: "", email: "", topic: "", message: "" });
  }

  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Eyebrow className="text-accent">Get in touch</Eyebrow>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Ask us anything about the route.
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/75">
            Cohort questions, track advice, a one-hour Pick My Brain consultation
            or a partnership idea — this reaches us directly.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.25fr_1fr]">
        <form onSubmit={handleSubmit} className="surface-card space-y-5 p-7" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" error={errors["name"]}>
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

          <Field label="What's this about?" error={errors["topic"]}>
            <select
              value={values.topic}
              onChange={(e) => setValues((v) => ({ ...v, topic: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Choose a topic…</option>
              {TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Message" error={errors["message"]}>
            <Textarea
              rows={6}
              value={values.message}
              maxLength={2000}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              placeholder="Tell us where you are on the route and what you need."
            />
          </Field>

          <Button type="submit" variant="brand" size="lg" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <Eyebrow>Direct contact</Eyebrow>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-primary">Email</p>
                  <a
                    href="mailto:info@thevapreneursschool.com"
                    className="text-muted-foreground underline-offset-4 hover:text-accent-deep hover:underline"
                  >
                    info@thevapreneursschool.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-primary">WhatsApp</p>
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline-offset-4 hover:text-accent-deep hover:underline"
                  >
                    0114 602 052
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-primary">LinkedIn</p>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline-offset-4 hover:text-accent-deep hover:underline"
                  >
                    The Vapreneurs School
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-primary">Response time</p>
                  <p className="text-muted-foreground">Within 1 business day</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
