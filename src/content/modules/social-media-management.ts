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
    fileName: "SMM-Module-1-Notes.doc",
    intro:
      "SOCIAL MEDIA MANAGEMENT — Coaching Notes for Virtual Assistants. Module 1: Social Media Fundamentals & Strategy. The foundation — before posting, you must understand why and who you are posting for.",
    blocks: [
      { type: "heading", text: "1. Defining Goals — The SMART Framework" },
      { type: "subheading", text: "Why Goal-Setting Comes First" },
      {
        type: "list",
        items: [
          "Without clear goals, social media becomes random activity — posting for the sake of posting. Goals give every piece of content a purpose and make performance measurable.",
          "Goals also determine budget, content type, posting frequency, and which metrics you track. A VA must understand the client's business goals before touching any platform.",
        ],
      },
      { type: "subheading", text: "Breaking Down SMART" },
      {
        type: "table",
        headers: ["Letter", "What it means"],
        rows: [
          ["S — Specific", "The goal must be clear and well-defined. Not \"grow Instagram\" but \"gain 500 new Instagram followers in 60 days.\" The more precise, the easier it is to build a strategy around it."],
          ["M — Measurable", "Must be trackable with data. Attach a number to every goal — follower count, engagement rate, click-throughs, leads generated, DM inquiries, website visits from social."],
          ["A — Attainable", "Ambitious but realistic given the client's current audience size, budget, and industry. A brand-new account targeting 10,000 followers in 30 days is not attainable — it sets the client up for disappointment."],
          ["R — Relevant", "The social media goal must connect directly to the client's broader business goal. If the business goal is to book more clients, the relevant social goal is leads and conversions — not just likes."],
          ["T — Time-bound", "Every goal needs a deadline. Without one, there is no urgency and no checkpoint for evaluation. Example: \"Increase LinkedIn post engagement rate from 1.2% to 3% within 90 days.\""],
        ],
      },
      { type: "subheading", text: "Common Goal Categories for Clients" },
      {
        type: "list",
        items: [
          "Brand awareness: Growing reach, impressions, and follower count. Ideal for new businesses or rebrands. Metric: reach, impressions, follower growth rate.",
          "Community building: Growing engagement — comments, shares, saves, DMs. Metric: engagement rate, reply volume, community size.",
          "Lead generation: Getting potential customers into the client's pipeline. Metric: link clicks, form submissions, DM inquiries, email sign-ups from social.",
          "Sales & conversions: Driving purchases or bookings directly from social. Metric: conversion rate, revenue attributed to social, promo code redemptions.",
          "Customer retention & loyalty: Keeping existing customers engaged and coming back. Metric: repeat engagement, community participation, brand sentiment.",
          "Thought leadership & authority: Positioning the client as an expert. Metric: share volume, media mentions, speaking invitations, inbound collaborations.",
        ],
      },
      {
        type: "callout",
        title: "VA Tip",
        text: "Always start a client onboarding call by asking \"What does success look like for you in the next 90 days?\" Then translate their answer into a SMART goal they can sign off on. This protects you and aligns expectations from day one.",
      },
      { type: "heading", text: "2. Audience Research & Persona Development" },
      { type: "subheading", text: "Why This Step Cannot Be Skipped" },
      {
        type: "list",
        items: [
          "You cannot create content that resonates if you do not know who you are talking to. The audience shapes everything — the platform, the tone, the content format, the posting time, and the call to action.",
          "Most VAs skip this step and wonder why content isn't converting. Audience research is the difference between strategic content and random posting.",
        ],
      },
      { type: "subheading", text: "Layer 1 — Demographics (Who They Are)" },
      {
        type: "list",
        items: [
          "Age range: Dictates platform preference and communication style. Gen Z (18–24) gravitates to TikTok, short-form video, and casual language. Millennials (25–40) use Instagram, LinkedIn. Older demographics lean toward Facebook.",
          "Gender: Helps shape visual aesthetics, tone, and product framing — though always avoid assumptions; use platform analytics to confirm.",
          "Location: Determines language, cultural references, time zones for posting, and whether content needs to be localised or kept global.",
          "Occupation & income: Affects what they can afford, what problems they face professionally, and what type of content they consume.",
          "Education level: Informs vocabulary complexity and the level of technicality in explanations.",
        ],
      },
      { type: "subheading", text: "Layer 2 — Psychographics (How They Think & Feel)" },
      {
        type: "list",
        items: [
          "Values & beliefs: What does the audience care about deeply? Sustainability, family, financial freedom, creativity? Content that aligns with values builds instant connection.",
          "Interests & hobbies: What do they consume outside of work? This reveals content hooks and collaboration opportunities.",
          "Lifestyle: Are they busy parents, remote workers, entrepreneurs, side-hustlers? This shapes the format (quick tips vs. long-form), the timing, and the tone.",
          "Motivations: What do they want to achieve? Status, freedom, connection, security? Great content speaks directly to an underlying motivation.",
          "Fears & frustrations: What keeps them up at night? What have they tried that hasn't worked? Pain points are the most powerful content hooks.",
        ],
      },
      { type: "subheading", text: "Layer 3 — Behavioural Data (What They Do Online)" },
      {
        type: "list",
        items: [
          "Platform usage habits: When are they online? How long do they scroll? Do they prefer to watch or read?",
          "Content consumption: Do they engage with video, carousels, polls, live sessions, stories, or long-form posts?",
          "Buying behaviour: Do they research before buying? Are they impulse buyers? Do they need social proof first?",
          "Engagement patterns: Are they commenters, sharers, savers, or passive scrollers? This determines what type of CTA to use.",
        ],
      },
      { type: "subheading", text: "Building an Audience Persona" },
      {
        type: "list",
        items: [
          "A persona is a fictional but data-backed character representing the ideal audience member. Every piece of content is written to this person.",
          "Persona elements to define: Name, age, job title, income, platforms used, daily challenges, what they read/watch, goals, objections to buying, and what they wish someone would say to them.",
          "Where to gather data: Client's existing analytics (Instagram Insights, Facebook Audience Insights), Google Analytics, surveys, customer reviews, comment sections, Reddit threads, Facebook groups, competitor audiences.",
          "A client may have more than one persona — e.g. a coach may serve both the early-career professional and the experienced executive. Each persona may require different content pillars or even different platforms.",
        ],
      },
      {
        type: "callout",
        title: "VA Tip",
        text: "When onboarding a new client, ask for access to their existing analytics, their top 3 best customers, and their most frequent customer complaints. Real customer language is your goldmine for captions, hooks, and CTAs.",
      },
      { type: "heading", text: "3. Competitive Analysis" },
      { type: "subheading", text: "Purpose of a Competitive Audit" },
      {
        type: "list",
        items: [
          "Competitive analysis is not about copying competitors — it is about understanding what is already working in the market, identifying gaps no one is filling, and positioning the client's brand distinctly.",
          "It also gives you a benchmark. If every competitor posts 5 times per week and averages 2% engagement, you have a baseline to beat.",
        ],
      },
      { type: "subheading", text: "How to Identify Competitors to Audit" },
      {
        type: "list",
        items: [
          "Direct competitors: Businesses offering the same product or service to the same audience. These are the most important to audit.",
          "Indirect competitors: Businesses solving the same problem differently. Their content strategy may be more innovative and worth studying.",
          "Aspirational competitors: Brands in the same space but at a more advanced level. Useful for identifying where the client wants to grow toward.",
          "Find competitors via Google searches, hashtag research on Instagram/TikTok, LinkedIn search, and by asking the client directly who they admire or lose business to.",
        ],
      },
      { type: "subheading", text: "What to Audit — The 7 Key Areas" },
      {
        type: "list",
        ordered: true,
        items: [
          "Platform presence: Which platforms are they on? Which ones are they most active on? Are there platforms they are absent from that their audience uses?",
          "Posting frequency & consistency: How often do they post? Are they consistent or sporadic? Consistency is a major trust signal.",
          "Content types & formats: Are they using Reels, carousels, static posts, stories, long-form LinkedIn articles, YouTube videos? Which formats get the most engagement?",
          "Content themes & pillars: What topics do they repeatedly cover? What is their dominant content angle — educational, inspirational, promotional, entertaining?",
          "Engagement metrics: Look at likes, comments, shares, and saves. High follower counts with low engagement signals an inactive or purchased audience. High engagement on a small account signals strong community trust.",
          "Brand voice & visual identity: What is their tone — formal, conversational, witty, authoritative? Is their visual identity cohesive and recognisable in the feed?",
          "Community management: Do they respond to comments? How fast? What is the sentiment in their comment section?",
        ],
      },
      { type: "subheading", text: "Identifying Gaps & Opportunities" },
      {
        type: "list",
        items: [
          "Content gaps: Topics the audience clearly cares about (based on questions in comment sections or Reddit threads) that no competitor is addressing well.",
          "Format gaps: If all competitors only post static graphics and no one is doing educational Reels or carousel how-tos, that is a positioning opportunity.",
          "Platform gaps: If competitors are absent from a platform where the target audience is active, the client can own that space early.",
          "Tone gaps: If the niche is dominated by overly formal or corporate content, a brand with a warm, human, conversational voice will stand out.",
          "Community gap: If competitors have low engagement and poor community management, a client who genuinely responds and connects can quickly become the trusted brand in the space.",
        ],
      },
      {
        type: "callout",
        title: "Tools",
        text: "Manual platform review, Meta Ad Library (competitors' paid ads), Social Blade (follower growth tracking), Sprout Social, Phlanx Engagement Calculator, and reading competitors' comment sections for unfiltered audience feedback.",
      },
      { type: "heading", text: "4. Platform Selection" },
      { type: "subheading", text: "The Golden Rule of Platform Selection" },
      {
        type: "list",
        items: [
          "Be where your audience already is — not where you are most comfortable. Platform selection must always be driven by audience data and business goals, never personal preference or trend-chasing.",
          "It is far better to be excellent on two platforms than mediocre on five. Quality of presence beats quantity of platforms every time.",
        ],
      },
      { type: "subheading", text: "Platform Breakdown — Key Facts for VAs" },
      {
        type: "table",
        headers: ["Platform", "Key facts"],
        rows: [
          ["Instagram (Meta)", "Best for: visual brands, lifestyle, coaching, e-commerce, personal brands. Primary audience: 18–44. Strong for Reels (discovery), carousels (education & saves), and Stories (daily connection). Essential for most B2C brands."],
          ["Facebook (Meta)", "Best for: community-building (Groups), local businesses, older demographics (35–65+), paid advertising. Organic reach is low but Groups and targeted ads remain powerful tools. World's largest social network."],
          ["LinkedIn", "Best for: B2B brands, consultants, coaches, executives, corporate services. Audience: professionals aged 25–55. Text posts and carousels perform well. Organic reach is currently high — a significant opportunity."],
          ["TikTok", "Best for: discovery-driven growth, product-based businesses, educators, younger demographics (16–34). Unmatched organic reach for new accounts. Algorithm is content-first, not follower-first. Requires consistent video output."],
          ["Pinterest", "Best for: DIY, home décor, fashion, food, wedding, travel, and any visually rich niche. Functions as a search engine — content has a long shelf life (months to years). Excellent for e-commerce and blog traffic."],
          ["X (formerly Twitter)", "Best for: real-time conversation, news, tech, finance, and brands with a strong voice. Works well for thought leadership, live event commentary, and community discussion."],
          ["YouTube", "Best for: long-form education, tutorials, product reviews, vlogs, and authority-building. Second-largest search engine in the world. Content has the longest lifespan of any platform."],
          ["Threads / Emerging Platforms", "Threads (by Meta) is growing for conversational content. Early adoption of the right platform can create significant competitive advantage. Never spread clients too thin on emerging platforms."],
        ],
      },
      { type: "subheading", text: "Decision Framework — How to Choose" },
      {
        type: "list",
        ordered: true,
        items: [
          "Step 1 — Match audience: Where does the target persona spend time online? Use demographic data from the persona development step.",
          "Step 2 — Match content capacity: What type of content can the client realistically produce? If they cannot appear on camera, TikTok may not be the right starting point. If they love writing, LinkedIn may be ideal.",
          "Step 3 — Match goals: Brand awareness goals suit Instagram Reels and TikTok. Lead generation suits LinkedIn and Facebook. Sales suit Instagram Shopping and Pinterest. Community suits Facebook Groups and Instagram Stories.",
          "Step 4 — Match resources: Consider budget, time, team size, and skill set. Each platform has its own content demands. Do not recommend five platforms if the client has budget for one.",
          "Step 5 — Start with 1–2 platforms: Master them, build systems, and only expand when results and capacity allow. Spreading thin is one of the most common and costly mistakes.",
        ],
      },
      { type: "subheading", text: "Content Repurposing Across Platforms" },
      {
        type: "list",
        items: [
          "A single piece of cornerstone content (e.g. a long LinkedIn article or a YouTube video) can be repurposed across multiple platforms — quote graphics for Instagram, a short clip for TikTok/Reels, a summary thread for X, a pin for Pinterest.",
          "Repurposing is a core VA skill — it allows a client to maintain multi-platform presence without creating original content for every channel from scratch.",
          "Each repurposed piece must be natively formatted for the destination platform — aspect ratio, caption length, hashtag use, and tone all vary by platform.",
        ],
      },
      {
        type: "callout",
        title: "VA Tip",
        text: "When a client asks \"should we be on every platform?\" — that is your moment to demonstrate strategy over execution. Walk them through this decision framework. Recommending 1–2 focused platforms shows you understand their business, not just social media trends.",
      },
      { type: "heading", text: "Module 1 — Key Takeaways" },
      {
        type: "list",
        items: [
          "Goals before content",
          "Audience drives all decisions",
          "Audit before you build",
          "Right platform over all platforms",
          "Quality beats quantity",
          "Strategy = purpose + people + positioning",
        ],
      },
      {
        type: "callout",
        title: "Foundation principle",
        text: "A VA who understands the strategy behind social media will always outperform one who only knows how to post. Clients pay a premium for strategic thinking — this module is where that thinking starts. Every subsequent decision in content creation, scheduling, engagement, and reporting traces back to what is established here.",
      },
    ],
  },
  assignment: {
    title: "Module 1 assignment — Build a strategy foundation for one brand",
    intro:
      "Pick one real brand (a past client, a business you admire, or your own VA business) and work through the four decisions from this module in that order. Keep it to two pages maximum.",
    tasks: [
      "Write one SMART goal for the account — name the metric, the starting number, the target number and the deadline.",
      "Build a one-page audience profile with all three layers: demographics, psychographics and behavioural.",
      "Audit three competitors (two direct, one aspirational) across the seven audit areas in a simple table.",
      "From the audit, list three gaps: what everyone does, what nobody does, and what is clearly working.",
      "Recommend two platforms — one primary engine, one for repurposing — with a one-sentence reason for each.",
    ],
    deliverable:
      "One document (Google Doc, Word or PDF) containing the SMART goal, audience profile, competitor audit table, gap list and platform recommendation.",
    criteria: [
      "The goal is measurable and dated — not a wish.",
      "Every audience layer answers a different question about the person, with no overlap.",
      "The audit only records things visible from outside the account.",
      "Platform choices are justified by the audience and the goal, not by preference.",
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
