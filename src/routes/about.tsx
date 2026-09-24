import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, Globe2, Target } from "lucide-react";
import evePortrait from "@/assets/eve-wanjiru.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { SectionHeading, Eyebrow } from "@/components/brand/Section";

const TITLE = "About & Our Why | The VApreneurs School";
const DESCRIPTION =
  "Why The VApreneurs School exists: closing the gap between VA skills training and real business readiness. Founded by Eve Wanjiru.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Compass,
    title: "Clarity over hype",
    text: "No inflated income promises. Just a mapped route, honest expectations and work you can show a client.",
  },
  {
    icon: Target,
    title: "Practical by default",
    text: "Every module ends in a deliverable. If it can't go into your portfolio or a client's inbox, it doesn't belong in the curriculum.",
  },
  {
    icon: HeartHandshake,
    title: "Community as infrastructure",
    text: "Remote work is isolating. Cohorts, peers and accountability are part of the training, not a bonus.",
  },
  {
    icon: Globe2,
    title: "Globally competitive, proudly African",
    text: "We train to international standards so our students compete on quality, not on being the cheapest option.",
  },
];

function AboutPage() {
  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Eyebrow className="text-accent">Our why</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            The gap isn't skill. It's readiness.
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/75">
            Thousands of virtual assistants finish a course every year and still
            can't answer three questions: who do I serve, what exactly do I sell,
            and what is it worth? We built a school around those questions.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-5 text-base leading-relaxed text-foreground/85">
          <p>
            The virtual assistance industry has no shortage of training. Tools,
            platforms, certificates, checklists — all of it is available, much of
            it is good. And yet the same story repeats: a capable VA completes a
            programme, updates a profile, sends a handful of applications, and
            then waits.
          </p>
          <p>
            The missing piece was never technical ability. It was business
            readiness: positioning, pricing, pitching, boundaries, money
            management, and the resilience to keep going through a quiet month.
            Those things are treated as extras, when they are actually the
            difference between a skill and an income.
          </p>
          <p>
            The VApreneurs School was built to close that gap deliberately. The
            journey is mapped as three waypoints — learn the skill, position
            yourself, sustain the business — because that's the real order in
            which a VA career gets built. Skip the second waypoint and you stay
            invisible. Skip the third and you burn out.
          </p>
          <p className="border-l-2 border-accent pl-5 font-display text-xl leading-snug text-primary">
            "Map Your Skills, Scale Your Business" is not a slogan. It's the
            method: know exactly what you can do, then build a business around it
            on purpose.
          </p>
        </div>
      </section>

      <section className="bg-mint/60 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <img
  src="/ceo.jpg"
  alt="Eve Wanjiru, founder and CEO of The VApreneurs School"
  className="h-28 w-28 shrink-0 rounded-full object-cover object-top shadow-md"
/>

            <div>
              <Eyebrow>Founder &amp; CEO</Eyebrow>
              <h2 className="mt-2 text-3xl text-primary">Eve Wanjiru</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent-deep">
                Executive operations · Business systems · Process optimisation
              </p>
            </div>
          </div>
          <div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                Eve's background is in executive operations, business systems and
                process optimisation — the work of making organisations run
                cleanly behind the scenes. Years of building systems for
                executives and teams gave her a clear view of what remote support
                professionals are actually hired to do, and where most of them
                fall short.
              </p>
              <p>
                She founded The VApreneurs School to bridge the distance between
                technical skills and real-world readiness: not just teaching VAs
                how to use the tools, but how to think like operators, position
                like professionals and price like business owners.
              </p>
              <p>
                Her vision is a thriving community of world-class African virtual
                assistants who are globally competitive — recognised for the
                quality of their work, not chosen for the size of their invoice.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="navy">
                <Link to="/courses">See the curriculum</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://calendar.app.google/vtoGzuU1M1wzYUZw6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Pick My Brain session
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="What we stand on"
          title="Our values"
          intro="Four commitments that shape every module, cohort and conversation."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <article key={value.title} className="surface-card p-6">
              <value.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 text-lg text-primary">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
