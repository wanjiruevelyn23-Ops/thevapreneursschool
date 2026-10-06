import type { CourseModule } from "../types";
import { placeholderModule } from "../types";

/**
 * Public module outline only. Lesson notes, quizzes and assignments live in the
 * protected `module_content` table and are only served to actively enrolled students.
 */
const module1: CourseModule = {
  slug: "module-1",
  number: 1,
  title: "Social Media Strategy Foundations",
  summary:
    "Set SMART goals, research your audience in three layers, audit competitors across seven areas, and choose the right platforms.",
  duration: "50 min",
  lesson: [],
  quiz: [],
};

export const socialMediaModules: CourseModule[] = [
  module1,
  placeholderModule(
    2,
    "Content Strategy & Content Pillars",
    "Turn strategy into three to five repeatable pillars and a monthly content calendar.",
  ),
  placeholderModule(
    3,
    "Content Creation & Design Basics",
    "Canva systems, brand templates, shooting simple reels and batching a month of assets.",
  ),
  placeholderModule(
    4,
    "Copywriting, Hooks & Captions",
    "Hook formulas, caption structures and calls to action that convert without sounding salesy.",
  ),
  placeholderModule(
    5,
    "Scheduling & Community Management",
    "Scheduling tools, publishing workflows, DM handling and comment moderation for clients.",
  ),
  placeholderModule(
    6,
    "Paid Social Fundamentals",
    "Boosting vs campaigns, audiences, budgets and reading ad results without a media buyer.",
  ),
  placeholderModule(
    7,
    "Analytics & Client Reporting",
    "Which metrics matter per goal, and building a monthly report a client actually reads.",
  ),
  placeholderModule(
    8,
    "Client Onboarding, Packages & Retainers",
    "Scoping social media retainers, onboarding questionnaires and monthly delivery rhythms.",
  ),
];
