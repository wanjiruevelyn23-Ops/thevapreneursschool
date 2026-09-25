import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, CalendarDays, Users, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, Eyebrow } from "@/components/brand/Section";
import { ACCELERATOR } from "@/content/courses";

const TITLE = "The VApreneurs School — The Accelerator | 10 Days, Live";
const DESCRIPTION =
  "Done with your VA course… now what? A 10-day live, cohort-based accelerator covering personal branding, ideal client definition, client acquisition, portfolio building, onboarding, pricing, contracts and proposals.";

export const Route = createFileRoute("/accelerator")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AcceleratorPage,
});

const DETAILS = [
  { icon: CalendarDays, label: "Length", value: "10 days" },
  { icon: Users, label: "Format", value: "Live sessions + private community" },
  { icon: Lock, label: "Prerequisite", value: "Any 1 completed skill track" },
  { icon: Sparkles, label: "Intake", value: "Cohort 1 · limited seats" },
];

function AcceleratorPage() {
  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <Eyebrow className="text-accent">Waypoint 2 · Position yourself</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] sm:text-5xl">
            The VApreneurs School — The Accelerator
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75">
            You have the skill. What you don't have yet is a brand, a niche, a
            pipeline and a price you can defend. The Accelerator is 10 live days
            built to install exactly that — with a cohort moving beside you.
          </p>

          {/* 💰 HEADER DISCOUNTED PRICING & DATE MATRIX */}
          <div className="mt-6 mb-2 p-4 bg-white/10 rounded-xl border border-white/20 inline-flex flex-wrap items-center gap-4 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Special Launch Offer</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm line-through text-primary-foreground/50 font-medium">Ksh 4,500</span>
                <span className="text-2xl font-black text-white tracking-tight">Ksh 3,999</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Next Kick-off</span>
              <span className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-accent" /> October 28th
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-accent text-accent-foreground rounded-md uppercase tracking-wide">
              Save 11%
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
                Apply to Cohort 1 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="onNavy" size="lg">
              <Link to="/courses">Start a skill track first</Link>
            </Button>
          </div>

          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DETAILS.map((detail) => (
              <div
                key={detail.label}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4"
              >
                <detail.icon className="h-5 w-5 text-accent" />
                <dt className="eyebrow mt-3 text-primary-foreground/60">
                  {detail.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Curriculum"
          title="Seven pillars over ten days"
          intro="Each pillar is taught live, then applied to your own business before the next one starts."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ACCELERATOR.pillars.map((pillar) => (
            <article key={pillar.number} className="surface-card p-6">
              <span className="font-mono text-xs text-accent-deep">
                Pillar 0{pillar.number}
              </span>
              <h3 className="mt-3 text-xl text-primary">{pillar.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {pillar.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-mint/60 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who it's for" title="This cohort is for you if…" />
            <ul className="mt-8 space-y-3">
              {ACCELERATOR.whoFor.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-8">
            <Eyebrow>Cohort 1 details</Eyebrow>
            <h3 className="mt-3 text-2xl text-primary">What you get</h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/85">
              {[
                "10 consecutive days of live, cohort-based sessions",
                "Private community for the duration and beyond",
                "Working sessions where you build your own brand assets",
                "Positioning and pricing review with direct feedback",
                "A finished offer, pitch and pricing sheet by day 10",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            {/* 💰 CARD BOTTOM DISCOUNTED PRICING & DATE MATRIX */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Investment</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs line-through text-muted-foreground/60 font-medium">Ksh 4,500</span>
                  <span className="text-xl font-extrabold text-primary tracking-tight">Ksh 3,999</span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Commences</span>
                <span className="text-sm font-semibold text-primary mt-0.5">
                  October 28th
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-accent/30 bg-mint p-4">
              <p className="eyebrow text-accent-deep">Prerequisite</p>
              <p className="mt-2 text-sm text-primary">
                {ACCELERATOR.prerequisite}. If you haven't started one yet, begin a
                track today and apply in the same breath.
              </p>
            </div>
            <Button asChild variant="brand" className="mt-6 w-full">
              <Link to="/apply" search={{ course: "accelerator", track: "coaching" }}>
                Apply to Cohort 1
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
