import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading, Eyebrow } from "@/components/brand/Section";
import { CourseCard } from "@/components/brand/CourseCard";
import { SKILL_TRACKS, TOOLKIT_COURSES } from "@/content/courses";

const TITLE = "Courses — Skill Tracks & Sustain Toolkit | The VApreneurs School";
const DESCRIPTION =
  "Four self-taught VA skill tracks (social media, admin, project management, AI & automation) plus three Sustain Toolkit courses. Self-taught or with added coaching.";

export interface Course {
  slug: string;
  title: string;
  priceKES: number;
  isFree: boolean;
  requiresWaitingList: boolean;
  launchDate: string;
  description: string;
}

export const ACCELERATOR = {
  slug: "accelerator-cohort-1",
  title: "10-Day Virtual Assistant Accelerator",
  cohort: "Cohort 1",
  priceKES: 3999,
  isFree: false,
  requiresWaitingList: false, // 💳 Instant Access!
  launchDate: "2026-10-28T00:00:00",
};

// 🎓 Skill Tracks Grid Array Map (Waypoint 1)
export const SKILL_TRACKS: Course[] = [
  {
    slug: "admin-va",
    title: "Administrative Virtual Assistant Core",
    priceKES: 3499,
    isFree: false,
    requiresWaitingList: true, // ⏳ Waiting List
    launchDate: "2026-10-28T00:00:00",
    description: "Master calendar optimization, inbox triaging pipelines, and professional corporate scheduling matrices."
  },
  {
    slug: "smm-va",
    title: "Social Media Management (SMM) Specialist",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    launchDate: "2026-10-28T00:00:00",
    description: "Content scheduling calendars, audience engagement blueprints, and community growth mechanics."
  },
  {
    slug: "project-management",
    title: "Digital Project Management & Operations",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    launchDate: "2026-10-28T00:00:00",
    description: "Structure cross-functional tasks using modern tools like Notion, Asana, and click-up sprint structures."
  },
  {
    slug: "ai-automation",
    title: "AI & Workflow Automation Architect",
    priceKES: 6499,
    isFree: false,
    requiresWaitingList: true,
    launchDate: "2026-10-28T00:00:00",
    description: "Connect APIs with Make.com and Zapier to build self-running business infrastructure components."
  }
];

// 🧰 Sustain Toolkit Grid Array Map (Waypoint 3)
export const TOOLKIT_COURSES: Course[] = [
  {
    slug: "finance-management",
    title: "Financial Management for Digital Professionals",
    priceKES: 2999,
    isFree: false,
    requiresWaitingList: true,
    launchDate: "2026-10-28T00:00:00",
    description: "Invoicing strategies, tax filing preparation loops, and multi-currency income allocation routines."
  },
  {
    slug: "imposter-syndrome",
    title: "Overcoming Imposter Syndrome & Scaling Confidently",
    priceKES: 2999,
    isFree: false,
    requiresWaitingList: true,
    launchDate: "2026-10-28T00:00:00",
    description: "Psychological framing toolkits to confidently talk to high-ticket foreign corporate decision makers."
  },
  {
    slug: "dilemma-assessment",
    title: "The Dilemma Assessment & Strategy Guide",
    priceKES: 0,
    isFree: true,
    requiresWaitingList: true,
    launchDate: "2026-10-19T00:00:00", // 🗓️ Available starting October 19th!
    description: "Identify client operation bottlenecks using our proprietary professional diagnostic mapping tool."
  }
];

export function getCourse(slug: string): Course | undefined {
  if (slug === ACCELERATOR.slug) return ACCELERATOR as Course;
  return SKILL_TRACKS.find((c) => c.slug === slug) || TOOLKIT_COURSES.find((c) => c.slug === slug);
}
