import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-va.jpg";
import { Button } from "@/components/ui/button";
import { RouteMap, WaypointStrip } from "@/components/brand/RouteMap";
import { SectionHeading, Eyebrow } from "@/components/brand/Section";
import { CourseCard } from "@/components/brand/CourseCard";
import { SKILL_TRACKS, TOOLKIT_COURSES, ACCELERATOR } from "@/content/courses";

const TITLE = "The VApreneurs School — Map Your Skills, Scale Your Business";
const DESCRIPTION =
  "Training and mentorship for virtual assistants: four skill tracks, a 10-day live Accelerator, and toolkits to sustain the business you build.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <Eyebrow className="text-accent">
              Virtual assistant training &amp; mentorship
            </Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              Map Your Skills,
              <br />
              <span className="text-accent">Scale Your Business.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/75">
              Most VAs finish a course and still don't know how to get paid well.
              The VApreneurs School plots the whole journey — the skill, the
              positioning, and the business that keeps going after the first client.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg">
                <Link to="/courses">
                  Explore the skill tracks <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="onNavy" size="lg">
                <Link to="/accelerator">See Cohort 1</Link>
              </Button>
            </div>

            <RouteMap className="mt-12 max-w-xl" />
            <div className="mt-3 flex max-w-xl justify-between font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary-foreground/60">
              <span>Learn the skill</span>
              <span>Position yourself</span>
              <span>Sustain it</span>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-7">
            <p className="eyebrow text-accent">Now enrolling</p>
            <p className="mt-3 font-display text-2xl leading-snug text-primary-foreground">
              Accelerator Cohort 1
            </p>
            <p className="mt-2 text-sm text-primary-foreground/70">
              10 days, live + community, limited seats. Prerequisite: any one skill
              track.
            </p>
            <div className="mt-6 grid gap-3 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/75">
              <p>4 pillars: branding, positioning, client acquisition, pricing</p>
              <p>7 courses across 3 waypoints</p>
              <p>Portfolio-ready deliverable in every module</p>
            </div>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="The route"
          title="Three waypoints from skilled to self-sufficient"
          intro="Every part of the school sits on one of three waypoints. Start where you are, and follow the line."
        />
        <div className="mt-10">
          <WaypointStrip />
        </div>
      </section>

      <section className="bg-mint/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Waypoint 1 · Learn the skill"
            title="Four self-taught skill tracks"
            intro="Take any track on your own, or add coaching for feedback, accountability and portfolio review."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {SKILL_TRACKS.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="surface-card overflow-hidden">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
            <div>
              <Eyebrow>Waypoint 2 · Position yourself</Eyebrow>
              <h2 className="mt-4 text-3xl text-primary sm:text-4xl">
                "Done With My VA Course… Now What?"
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The Accelerator is 10 live days that turn a trained VA into a
                positioned business owner: personal branding, market positioning,
                client acquisition and pricing.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="navy">
                  <Link to="/accelerator">Accelerator details</Link>
                </Button>
                <Button asChild variant="brand">
                  <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
                    Apply to Cohort 1
                  </Link>
                </Button>
              </div>
            </div>
            <ul className="space-y-3 rounded-xl bg-mint/70 p-6">
              {ACCELERATOR.pillars.map((pillar) => (
                <li key={pillar.number} className="flex gap-3">
                  <span className="mt-0.5 font-mono text-xs text-accent-deep">
                    0{pillar.number}
                  </span>
                  <span className="text-sm font-medium text-primary">{pillar.title}</span>
                </li>
              ))}
              <li className="border-t border-accent/20 pt-3 font-mono text-[0.6875rem] uppercase tracking-widest text-accent-deep">
                Prerequisite: any 1 skill track
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="sustain" className="mx-auto max-w-6xl px-5 pb-20">
        <SectionHeading
          eyebrow="Waypoint 3 · Sustain the business"
          title="The Sustain Toolkit"
          intro="Three standalone courses for the parts of the business nobody warns you about."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TOOLKIT_COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-navy py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-accent">Cohort 1 · 10 days · live + community</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Seats for Cohort 1 are limited.
            </h2>
            <p className="mt-3 text-primary-foreground/75">
              Finish a skill track, then join the cohort that turns it into paid work.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
              {["10 focused days", "Live sessions", "Private community", "Limited seats"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent" /> {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <Button asChild variant="brand" size="lg">
            <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
              Apply to Cohort 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
