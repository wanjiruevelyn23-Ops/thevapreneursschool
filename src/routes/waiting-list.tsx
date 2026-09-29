import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { COURSES, getCourse } from "@/content/courses";

const waitingListSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a reachable phone number")
    .max(30),
  course: z.string().min(1, "Please select a course"),
  message: z.string().trim().max(1500).optional(),
});

export const Route = createFileRoute("/waiting-list")({
  validateSearch: z.object({
    course: z.string().optional(),
  }),
  component: WaitingListPage,
});

function WaitingListPage() {
  const search = Route.useSearch();

  const selectedCourse = search.course
    ? getCourse(search.course)
    : undefined;

  const waitlistCourses = COURSES.filter(
    (course) => course.availability === "waiting-list",
  );

  const [courseSlug, setCourseSlug] = useState(search.course ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentCourse = getCourse(courseSlug);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = waitingListSchema.safeParse({
      name,
      email,
      phone,
      course: courseSlug,
      message,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Please check your details and try again.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xdekyznp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Form: "Course Waiting List",
          Name: parsed.data.name,
          Email: parsed.data.email,
          Phone: parsed.data.phone,
          Course: currentCourse?.title ?? parsed.data.course,
          Course_Slug: parsed.data.course,
          Message: parsed.data.message ?? "No additional message",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong while submitting your details. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />

        <h1 className="mt-6 text-3xl text-primary">
          You’re on the waiting list
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thanks, {name}. You’ve joined the waiting list for{" "}
          <strong className="text-foreground">
            {currentCourse?.title ?? "your selected course"}
          </strong>
          . We’ll be in touch when enrolment opens.
        </p>

        <Button asChild variant="brand" className="mt-8">
          <Link to="/courses">
            Explore courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-deep">
          Course enrolment
        </p>

        <h1 className="mt-3 text-4xl text-primary md:text-5xl">
          Join the Waiting List
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Be the first to know when enrolment opens for your chosen course.
          Leave your details below and we’ll notify you when it becomes
          available.
        </p>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-24">
        {selectedCourse ? (
          <div className="mb-5 rounded-lg border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              You’re joining the waiting list for
            </p>

            <p className="mt-1 text-lg font-semibold text-primary">
              {selectedCourse.title}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {selectedCourse.price}
            </p>
          </div>
        ) : (
          <div className="mb-5 rounded-lg border border-border bg-card p-5">
            <Label htmlFor="course">Course</Label>

            <select
              id="course"
              value={courseSlug}
              onChange={(event) => setCourseSlug(event.target.value)}
              className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a course</option>

              {waitlistCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title} — {course.price}
                </option>
              ))}
            </select>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="surface-card space-y-5 p-7"
          noValidate
        >
          <div>
            <Label htmlFor="name">Full name</Label>

            <Input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone / WhatsApp</Label>

            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+254..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>

            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Anything you'd like us to know?"
              className="mt-2"
              rows={4}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Joining…" : "Join Waiting List"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </section>
    </main>
  );
}
