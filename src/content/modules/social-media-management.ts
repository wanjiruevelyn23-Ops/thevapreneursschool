import type { CourseModule } from "../types";
import { placeholderModule } from "../types";

/**
 * Module 1 — the only fully written module so far. Use this file as the template
 * for every new module: lesson blocks, quiz questions, and original notes.
 */
const module1: CourseModule = {
  slug: "module-1",
  number: 1,
  title: "Social Media Strategy Foundations",
  summary:
    "Set SMART goals, research your audience in three layers, audit competitors across seven areas, and choose the right platforms.",
  duration: "50 min",
  lesson: [
    {
      type: "paragraph",
      text: "Every social media account that works is working on purpose. Before a single post is designed, a social media manager decides what the account is for, who it is talking to, what the competition already does, and where the audience actually spends time. This module covers those four decisions in order.",
    },
    { type: "heading", text: "1. Goal setting with the SMART framework" },
    {
      type: "paragraph",
      text: '"Grow the page" is not a goal — it is a wish. A goal is only usable when you can tell, on a specific date, whether you hit it. The SMART framework turns intentions into measurable commitments.',
    },
    {
      type: "table",
      headers: ["Letter", "Means", "Ask yourself"],
      rows: [
        ["S — Specific", "One clear outcome, not a bundle", "What exactly will change?"],
        ["M — Measurable", "A number you can pull from analytics", "Which metric, and what value?"],
        ["A — Achievable", "Realistic for the resources available", "Can we do this with our budget and time?"],
        ["R — Relevant", "Tied to the client's business objective", "Does this move revenue, leads or retention?"],
        ["T — Time-bound", "A deadline", "By when?"],
      ],
    },
    {
      type: "callout",
      title: "Weak vs SMART",
      text: 'Weak: "Get more Instagram followers." SMART: "Grow the Instagram following from 1,200 to 1,800 by 30 June by publishing four reels a week aimed at Nairobi-based small business owners, to increase discovery calls booked."',
    },
    {
      type: "paragraph",
      text: "Goals fall into three families: awareness (reach, impressions, follower growth), engagement (comments, saves, shares, DMs) and conversion (link clicks, leads, sales). Pick a primary family per account. An account chasing all three at once usually delivers none.",
    },
    { type: "heading", text: "2. Audience research in three layers" },
    {
      type: "paragraph",
      text: "You cannot write for someone you cannot describe. Audience research is done in three layers, and each layer answers a different question about the person on the other side of the screen.",
    },
    { type: "subheading", text: "Layer 1 — Demographics: who they are" },
    {
      type: "list",
      items: [
        "Age range and generation",
        "Gender split",
        "Location, city and time zone",
        "Language",
        "Income bracket and job title or industry",
        "Education and life stage (student, new parent, business owner)",
      ],
    },
    { type: "subheading", text: "Layer 2 — Psychographics: why they act" },
    {
      type: "list",
      items: [
        "Values and beliefs",
        "Goals and aspirations",
        "Pain points, fears and frustrations",
        "Interests, hobbies and the accounts they already follow",
        "Buying motivations and objections",
      ],
    },
    { type: "subheading", text: "Layer 3 — Behavioural: how they use the platform" },
    {
      type: "list",
      items: [
        "Which platforms they actually open, and when",
        "Content formats they engage with (reels, carousels, long-form, live)",
        "Device — mostly mobile, sometimes desktop",
        "How they discover new brands (search, explore page, referrals, ads)",
        "How they buy — DM, website, WhatsApp, in person",
      ],
    },
    {
      type: "callout",
      title: "Where the data comes from",
      text: "Native platform insights, the client's existing customer list, comment and DM history, competitor comment sections, short customer interviews, and simple polls in stories. Two 15-minute customer conversations beat an hour of guessing.",
    },
    { type: "heading", text: "3. Competitive analysis — the seven audit areas" },
    {
      type: "paragraph",
      text: "Choose three to five competitors: two direct, one aspirational (bigger, doing it well) and one adjacent (same audience, different product). Audit each across these seven areas and record what you find in a simple spreadsheet.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Profile and positioning — bio, handle, link, highlights: is it instantly clear what they sell and to whom?",
        "Content pillars and themes — what recurring topics do they post, and which pillar dominates?",
        "Posting frequency and cadence — how often, on which days, and how consistently?",
        "Format mix — reels vs carousels vs statics vs stories, and which format they lean on for growth.",
        "Engagement quality — not just counts: are comments real conversations, do they reply, what are people asking?",
        "Visual and verbal identity — colours, fonts, templates, tone of voice, hooks they reuse.",
        "Offers and calls to action — how they sell, how often, pricing signals, lead magnets and funnels.",
      ],
    },
    {
      type: "paragraph",
      text: "The output of the audit is not admiration — it is a gap list: what everyone is doing (table stakes you must match), what nobody is doing (your opening), and what is clearly working (formats worth adapting, never copying).",
    },
    { type: "heading", text: "4. Platform selection" },
    {
      type: "paragraph",
      text: "Platform choice follows the audience and the goal — never the manager's personal preference. Pick two platforms you can do excellently rather than five you can do badly, and let one be the primary engine while the other repurposes.",
    },
    {
      type: "table",
      headers: ["Platform", "Strongest for", "Best fit when"],
      rows: [
        ["Instagram", "Visual brands, community, discovery via reels", "Audience is B2C, 18–45, mobile-first"],
        ["LinkedIn", "B2B authority, lead generation, hiring", "You sell services to businesses or professionals"],
        ["TikTok", "Fast reach, trends, top-of-funnel discovery", "Audience is young and you can publish often"],
        ["Facebook", "Groups, local business, older demographics", "Community and local trust matter"],
        ["X / Twitter", "Real-time commentary, tech and media niches", "Text-first thought leadership"],
        ["Pinterest", "Evergreen search traffic, lifestyle niches", "Content has long shelf life and drives clicks"],
        ["YouTube", "Long-form education, search visibility, trust", "You can commit to depth over volume"],
      ],
    },
    {
      type: "callout",
      title: "Deliverable for this module",
      text: "Write one SMART goal, a one-page audience profile with all three layers, a competitor audit sheet covering the seven areas for three competitors, and a two-platform recommendation with a one-sentence reason for each.",
    },
    {
      type: "quote",
      text: "Strategy is deciding what you will not post. Everything else is just being busy.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: 'Which of these is a properly SMART social media goal?',
      options: [
        "Grow our Instagram followers as fast as possible.",
        "Grow the Instagram following from 1,200 to 1,800 by 30 June by publishing four reels a week.",
        "Post more reels because reels are performing well right now.",
        "Become the biggest brand in our industry on social media.",
      ],
      answerIndex: 1,
      explanation:
        "Only option 2 names a specific metric, a starting and target number, a deadline, and the activity that gets you there.",
    },
    {
      id: "q2",
      question:
        "A client's audience is described as 'women 25–34, based in Nairobi, mostly small business owners'. Which research layer is this?",
      options: ["Psychographics", "Behavioural", "Demographics", "Competitive"],
      answerIndex: 2,
      explanation:
        "Age, gender, location and job title are demographic facts — who they are, not why they act or how they use the platform.",
    },
    {
      id: "q3",
      question: "Which of the following is NOT one of the seven competitive audit areas?",
      options: [
        "Posting frequency and cadence",
        "Engagement quality",
        "The competitor's internal ad budget and profit margin",
        "Offers and calls to action",
      ],
      answerIndex: 2,
      explanation:
        "Internal financials aren't observable from outside. The seven areas are all things you can see on the account itself.",
    },
    {
      id: "q4",
      question: "What should drive the choice of which platforms a client posts on?",
      options: [
        "Where the target audience already spends time, plus the account's primary goal",
        "Whichever platforms the social media manager enjoys using most",
        "All major platforms, so nothing is missed",
        "Whichever platform is trending in the news that month",
      ],
      answerIndex: 0,
      explanation:
        "Audience and goal decide the platform. Two platforms done excellently beat five done badly.",
    },
  ],
  notes: {
    title: "Module 1 — Original notes (unedited)",
    fileName: "SMM-Module-1-Original-Notes.doc",
    paragraphs: [
      "MODULE 1: SOCIAL MEDIA STRATEGY FOUNDATIONS — ORIGINAL WORKING NOTES",
      "GOAL SETTING",
      "Goals must be SMART. Specific — one outcome, clearly stated. Measurable — a number from analytics. Achievable — realistic with the time and budget on the table. Relevant — tied to what the business actually needs (leads, sales, retention). Time-bound — has a deadline.",
      'Bad goal: "grow the page". Good goal: "grow IG following 1,200 -> 1,800 by 30 June, four reels/week targeted at Nairobi SME owners, so we book more discovery calls."',
      "Three goal families: awareness (reach, impressions, follower growth), engagement (comments, saves, shares, DMs), conversion (clicks, leads, sales). Choose ONE primary per account. Chasing all three = achieving none.",
      "AUDIENCE RESEARCH — THREE LAYERS",
      "Layer 1, demographics (who): age/generation, gender, location + city + time zone, language, income bracket, job title/industry, education, life stage.",
      "Layer 2, psychographics (why): values and beliefs, goals and aspirations, pain points and fears, interests and hobbies, other accounts they follow, buying motivations, objections.",
      "Layer 3, behavioural (how): which platforms they actually open and at what times, formats they engage with (reels/carousels/long-form/live), device (mostly mobile), how they discover brands (search, explore, referral, ads), how they buy (DM, website, WhatsApp, in person).",
      "Sources of data: native insights, client's customer list, comments and DMs, competitor comment sections, short customer interviews, story polls. Two 15-minute customer conversations > one hour of guessing.",
      "COMPETITIVE ANALYSIS",
      "Pick 3–5 competitors: two direct, one aspirational (bigger, doing it well), one adjacent (same audience, different product).",
      "Seven audit areas: (1) profile and positioning — bio, handle, link, highlights; is it obvious what they sell and to whom. (2) content pillars and themes — recurring topics, which pillar dominates. (3) posting frequency and cadence — how often, which days, how consistent. (4) format mix — reels vs carousels vs statics vs stories; which format drives growth. (5) engagement quality — real conversations or vanity numbers, do they reply, what do people ask. (6) visual and verbal identity — colours, fonts, templates, tone, repeated hooks. (7) offers and CTAs — how they sell, how often, pricing signals, lead magnets, funnel.",
      "Output = gap list. What everyone does (table stakes, must match). What nobody does (our opening). What is clearly working (adapt the format, never copy the post).",
      "PLATFORM SELECTION",
      "Follow the audience and the goal, not personal preference. Two platforms done excellently beat five done badly. One primary engine, one repurposing channel.",
      "Instagram — visual brands, community, reels discovery, B2C 18–45. LinkedIn — B2B authority and leads. TikTok — fast reach and trends, needs volume. Facebook — groups, local business, older demographic. X/Twitter — real-time commentary, tech and media. Pinterest — evergreen search traffic, lifestyle, drives clicks. YouTube — long-form education, search visibility, deep trust.",
      "MODULE DELIVERABLE",
      "One SMART goal. One-page audience profile covering all three layers. Competitor audit sheet: seven areas x three competitors. Two-platform recommendation with a one-line justification each.",
    ],
  },
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
