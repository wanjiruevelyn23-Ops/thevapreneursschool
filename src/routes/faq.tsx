import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand/Section";
import { ACCELERATOR } from "@/content/courses";
import certificateArt from "@/assets/certificate-faq.webp.asset.json";

const TITLE = "FAQs — Courses, Accelerator & Certificates | The VApreneurs School";
const DESCRIPTION =
  "Answers to common questions about VApreneurs School courses, coaching, the 10-day Accelerator, payment, the student portal and completion certificates.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

type QA = { q: string; a: string };

const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "Courses",
    items: [
      {
        q: "Which courses do you offer?",
        a: "Four skill tracks — Social Media Management, Administrative VA, Project Management, and AI & Automation — plus three Sustain Toolkit courses: Imposter Syndrome, Dilemma Assessment and Finance Management.",
      },
      {
        q: "When do the courses start?",
        a: "The skill tracks and Sustain Toolkit courses are not cohort-based. They're open to application at any time, and you start as soon as your place is confirmed.",
      },
      {
        q: "What's the difference between self-taught and coaching?",
        a: "Self-taught gives you the full module library, quizzes and notes in the student portal at your own pace. Adding coaching includes scheduled coaching calls, review of your module work and direct feedback on your portfolio.",
      },
      {
        q: "Do I need experience to join?",
        a: "No. The skill tracks are designed for beginners as well as working VAs who want to sharpen a skill. The Accelerator is the only programme with a prerequisite.",
      },
    ],
  },
  {
    title: "The Accelerator",
    items: [
      {
        q: "What is the Accelerator?",
        a: `A 10-day, cohort-based programme covering ten pillars — from personal branding and pricing to contracts, onboarding and pitching your first client. ${ACCELERATOR.format}.`,
      },
      {
        q: "When does the next cohort start?",
        a: `The next cohort kicks off on ${ACCELERATOR.startDate}. Seats are limited.`,
      },
      {
        q: "Is there a prerequisite?",
        a: `${ACCELERATOR.prerequisite}. If you haven't started one yet, you can begin a track and apply at the same time.`,
      },
      {
        q: "How are the 10 days delivered?",
        a: "Each day opens in your student portal with a video lesson, slides, resources, an assignment and a quiz. You can revisit any day that's already opened.",
      },
    ],
  },
  {
    title: "Applying, payment & the portal",
    items: [
      {
        q: "How do I enrol?",
        a: "Apply for the course you want, then create your student account and verify your email. Once we approve your application and your payment is confirmed, the course opens in your portal.",
      },
      {
        q: "I've created an account but can't see my course. Why?",
        a: "Your course appears only after your enrolment is approved and payment is confirmed. If it's been a while, contact us and we'll check your enrolment.",
      },
      {
        q: "Can I access the material on my phone?",
        a: "Yes. The student portal works on phones, tablets and computers.",
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        q: "Do I get a certificate?",
        a: "Yes. You receive a certificate of completion from The VApreneurs School when you finish a course, a coaching programme or the Accelerator.",
      },
      {
        q: "What do I need to do to earn it?",
        a: "Complete every module or day of your course, including the quizzes, and hand in the required assignments. Coaching and Accelerator students also need to take part in the sessions.",
      },
      {
        q: "How will I receive my certificate?",
        a: "Certificates are issued digitally after your completion is confirmed, so you can add them to your portfolio, CV and LinkedIn profile.",
      },
      {
        q: "Whose name appears on the certificate?",
        a: "The name on your student account. Please make sure it's spelled the way you want it to appear before you finish the course.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <>
      <header className="bg-gradient-navy text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Eyebrow className="text-accent">Frequently asked questions</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
              Questions, answered.
            </h1>
            <p className="mt-5 max-w-2xl text-primary-foreground/75">
              Everything you need to know about our courses, the Accelerator, enrolment and the
              certificates you earn when you finish.
            </p>
          </div>
          <img
            src={certificateArt.url}
            alt="Illustration of a certificate, a graduation cap and question bubbles"
            width={1536}
            height={1024}
            className="hidden w-full rounded-2xl md:block"
          />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-16">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-12">
            <h2 className="text-2xl text-primary">{group.title}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {group.items.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left text-base text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="rounded-xl border border-accent/30 bg-mint/60 p-6">
          <p className="font-display text-lg font-semibold text-primary">Still have a question?</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Send us a message and we'll get back to you.
          </p>
          <Button asChild variant="brand" size="sm" className="mt-4">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
