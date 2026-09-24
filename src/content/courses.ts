import type { Course } from "./types";
import { placeholderModule } from "./types";
import { socialMediaModules } from "./modules/social-media-management";

export const COURSES: Course[] = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    waypoint: 1,
    category: "skill",
    eyebrow: "Skill track · 8 modules",
    tagline: "Run client social accounts with a strategy behind every post.",
    description:
      "The full social media manager skill set, from goal setting and audience research through content systems, community management, paid basics and client reporting. Built for VAs who want to own a channel, not just schedule posts.",
    outcomes: [
      "Write SMART goals tied to a client's business objective",
      "Build audience profiles across demographic, psychographic and behavioural layers",
      "Run a seven-area competitor audit and turn it into a content gap list",
      "Design content pillars, calendars and reusable brand templates",
      "Report monthly on the metrics that match the goal",
    ],
    coaching: true,
    modules: socialMediaModules,
  },
  {
    slug: "admin-virtual-assistance",
    title: "Admin Virtual Assistance",
    waypoint: 1,
    category: "skill",
    eyebrow: "Skill track · 5 modules",
    tagline: "The core admin engine every busy founder pays for.",
    description:
      "Inbox and calendar control, document and data systems, research and reporting, plus the client communication habits that turn a one-off task into a long retainer.",
    outcomes: [
      "Take over an inbox and calendar without dropping anything",
      "Build file, folder and data systems a client can navigate alone",
      "Handle travel, research and recurring reporting requests",
      "Write SOPs so your work survives your holiday",
    ],
    coaching: true,
    modules: [
      placeholderModule(
        1,
        "The Admin VA Role & Scope",
        "What clients actually delegate first, where scope creep starts, and how to define your lane.",
      ),
      placeholderModule(
        2,
        "Inbox & Calendar Management",
        "Triage systems, labels and filters, scheduling across time zones and protecting deep work.",
      ),
      placeholderModule(
        3,
        "Documents, Data & File Systems",
        "Drive structures, naming conventions, spreadsheets, data entry accuracy and templates.",
      ),
      placeholderModule(
        4,
        "Travel, Research & Reporting",
        "Itineraries, vendor research, summarising findings and recurring status reports.",
      ),
      placeholderModule(
        5,
        "Client Communication & SOPs",
        "Update rhythms, expectation setting, handover documents and writing SOPs that scale.",
      ),
    ],
  },
  {
    slug: "project-management",
    title: "Project Management",
    waypoint: 1,
    category: "skill",
    eyebrow: "Skill track · 6 modules",
    tagline: "Move from doing tasks to running the whole delivery.",
    description:
      "Scoping, planning, tool setup, team coordination, risk handling and closeout — the skill that takes a VA from executor to the person the client trusts with the whole project.",
    outcomes: [
      "Scope a project into phases, milestones and owners",
      "Set up and run Asana, ClickUp or Trello properly",
      "Chair meetings and chase deliverables without friction",
      "Manage risk, change requests and quality checks",
      "Close projects with reporting and lessons learned",
    ],
    coaching: true,
    modules: [
      placeholderModule(
        1,
        "Project Management Foundations for VAs",
        "Project vs process work, lifecycles, and the PM vocabulary clients expect you to use.",
      ),
      placeholderModule(
        2,
        "Scoping & Planning",
        "Turning a vague brief into deliverables, milestones, dependencies and a realistic timeline.",
      ),
      placeholderModule(
        3,
        "Tools & Workflows",
        "Building boards, task templates and automations in Asana, ClickUp and Trello.",
      ),
      placeholderModule(
        4,
        "Team Coordination & Meetings",
        "Standups, agendas, action logs and following up so nothing quietly stalls.",
      ),
      placeholderModule(
        5,
        "Risk, Change & Quality",
        "Spotting risk early, handling scope changes and running quality checks before delivery.",
      ),
      placeholderModule(
        6,
        "Reporting & Project Closeout",
        "Status reporting, stakeholder updates, handover packs and a retrospective that improves the next one.",
      ),
    ],
  },
  {
    slug: "ai-and-automation",
    title: "AI & Automation",
    waypoint: 1,
    category: "skill",
    eyebrow: "Skill track · 6 modules",
    tagline: "Deliver twice the output and charge for the system, not the hours.",
    description:
      "Practical AI and automation for virtual assistants: prompting that produces usable work, AI-assisted content and research, and automations that quietly run a client's back office.",
    outcomes: [
      "Write prompts that produce client-ready output on the first pass",
      "Use AI for research, drafting, summarising and repurposing",
      "Build automations in Zapier or Make that remove manual work",
      "Package automation as a paid service instead of free extra effort",
    ],
    coaching: true,
    modules: [
      placeholderModule(
        1,
        "AI Foundations for VAs",
        "What today's tools are genuinely good at, where they fail, and how to choose per task.",
      ),
      placeholderModule(
        2,
        "Prompt Engineering That Works",
        "Role, context, constraints and examples — plus prompt libraries you reuse per client.",
      ),
      placeholderModule(
        3,
        "AI for Content & Research",
        "Drafting, repurposing, summarising long documents and fact-checking before delivery.",
      ),
      placeholderModule(
        4,
        "Automation with Zapier & Make",
        "Triggers, actions, filters and error handling in real client workflows.",
      ),
      placeholderModule(
        5,
        "Building Client Workflows End to End",
        "Mapping a manual process and rebuilding it as a documented automated system.",
      ),
      placeholderModule(
        6,
        "Ethics, Data Safety & Positioning",
        "Client data boundaries, disclosure, and marketing yourself as an AI-enabled VA.",
      ),
    ],
  },
  {
    slug: "imposter-syndrome",
    title: "Imposter Syndrome",
    waypoint: 3,
    category: "toolkit",
    eyebrow: "Sustain toolkit · 3 modules",
    tagline: "Charge, pitch and show up without waiting to feel ready.",
    description:
      "A short, practical course on the self-doubt that keeps skilled VAs underpricing, over-explaining and hiding from the clients they are already qualified to serve.",
    outcomes: [
      "Name the pattern behind your own hesitation",
      "Build evidence files that answer self-doubt with facts",
      "Pitch and price from competence rather than fear",
    ],
    coaching: false,
    modules: [
      placeholderModule(
        1,
        "Naming the Pattern",
        "The five imposter profiles and how each one shows up in a VA's business.",
      ),
      placeholderModule(
        2,
        "Evidence Over Feelings",
        "Building a wins file, reframing feedback and separating skill gaps from fear.",
      ),
      placeholderModule(
        3,
        "Showing Up Anyway",
        "Pitch scripts, pricing conversations and visible practice under real conditions.",
      ),
    ],
  },
  {
    slug: "dilemma-assessment",
    title: "Dilemma Assessment",
    waypoint: 3,
    category: "toolkit",
    eyebrow: "Sustain toolkit · 3 modules",
    tagline: "A decision framework for the calls that keep you up at night.",
    description:
      "Fire the client or renegotiate? Raise rates or add value? Niche down or stay open? A structured way to assess business dilemmas instead of deciding by mood.",
    outcomes: [
      "Separate a real dilemma from a decision you're avoiding",
      "Score options against values, cash and capacity",
      "Communicate hard decisions to clients cleanly",
    ],
    coaching: false,
    modules: [
      placeholderModule(
        1,
        "Framing the Dilemma",
        "Defining the actual choice, the constraints and the cost of doing nothing.",
      ),
      placeholderModule(
        2,
        "The Assessment Grid",
        "Scoring options against values, income, capacity and reputation risk.",
      ),
      placeholderModule(
        3,
        "Deciding & Communicating",
        "Committing to a call, scripting the conversation and reviewing the outcome.",
      ),
    ],
  },
  {
    slug: "finance-management",
    title: "Finance Management as a Remote Worker",
    waypoint: 3,
    category: "toolkit",
    eyebrow: "Sustain toolkit · 4 modules",
    tagline: "Irregular income, handled like a business.",
    description:
      "Money systems for remote freelancers: separating business and personal cash, pricing for profit, invoicing and getting paid across borders, and planning for tax and slow months.",
    outcomes: [
      "Run separate business and personal money systems",
      "Price so profit survives fees, tax and downtime",
      "Invoice and collect international payments reliably",
      "Build buffers for slow months and plan for tax",
    ],
    coaching: false,
    modules: [
      placeholderModule(
        1,
        "Money Systems & Separation",
        "Business vs personal accounts, bookkeeping basics and a weekly money routine.",
      ),
      placeholderModule(
        2,
        "Pricing for Profit",
        "Rate floors, hourly vs retainer vs project, and the true cost of your time.",
      ),
      placeholderModule(
        3,
        "Invoicing & Getting Paid",
        "Invoice templates, payment terms, cross-border transfers, fees and chasing late payers.",
      ),
      placeholderModule(
        4,
        "Buffers, Tax & Planning",
        "Emergency buffers, paying yourself consistently and setting money aside for tax.",
      ),
    ],
  },
];

export const SKILL_TRACKS = COURSES.filter((c) => c.category === "skill");
export const TOOLKIT_COURSES = COURSES.filter((c) => c.category === "toolkit");

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getModule(courseSlug: string, moduleSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.modules.findIndex((m) => m.slug === moduleSlug);
  if (index === -1) return undefined;
  return { course, module: course.modules[index], index };
}
export const ACCELERATOR = {
  slug: "accelerator",
  title: "The VApreneurs Accelerator",
  cohort: "Cohort 1",
  length: "10 days",
  format: "Live sessions + private community",
  prerequisite: "Completion of any one skill track",
  seats: "Limited seats",
  originalPrice: "Ksh 4,500",
  price: "Ksh 3,999",
  startDate: "October 28",
  pillars: [
    {
      number: 1,
      title: "Personal branding & positioning",
      text: "Build a professional identity that says what you do, who you do it for and why you're the safe choice — across your profile, portfolio and pitch.",
    },
    {
      number: 2,
      title: "Defining your ideal client",
      text: "Choose a niche and a service offer, size the market, and position against the thousands of generalist VAs competing on price.",
    },
    {
      number: 3,
      title: "Portfolio Building & Resume Creation",
      text: "Package your skills into a high-converting digital portfolio and a modern resume that proves you can handle real client workloads.",
    },
    {
      number: 4,
      title: "LinkedIn Optimization",
      text: "Turn your personal profile into a client magnet by rewriting your bio, structuring your experience, and positioning yourself as a premium service provider.",
    },
    {
      number: 5,
      title: "Pricing Your Services",
      text: "Ditch hourly rates for retainer models. Learn how to calculate your value, structure premium packages, and quote prices with complete confidence.",
    },
    {
      number: 6,
      title: "Client Acquisition Strategies: Crafting Irresistible Offers",
      text: "Master outbound pitching and inbound strategy. Learn how to build an offer so clear and valuable that your ideal clients can't say no.",
    },
    {
      number: 7,
      title: "Discovery Calls & Interviews",
      text: "Overcome call anxiety. Practice the exact script to lead sales conversations, handle client objections, and close the deal without feeling salesy.",
    },
         { 
      number: "8", 
      title: "Contracts, Proposals & Terms",
      text: "Protect your business and formalize your agreements. Create solid client proposals, service contracts, and boundary-setting onboarding terms."
    },
    { 
      number: "9", 
      title: "Client Onboarding Process",
      text: "Deliver a premium first impression. Set up the exact workflows, welcome packets, and communication systems to seamlessly transition a lead into a long-term client."
    },
    { 
      number: "10", 
      title: "Mock Testing & Real-World Application (Apply + Pitch to at Least One Job/Client)",
      text: "Put everything into immediate action. Complete live client simulation testing and launch your first real application pitch to secure your first paying client."
    },
 ],
  whoFor: [
    "You've finished a VA course but haven't landed consistent clients",
    "You can do the work, but freeze when it's time to pitch or price",
    "You're undercharging and you know it",
    "You want a niche and a clear offer instead of \"I do everything\"",
    "You want structure, accountability and peers for 10 focused days",
  ],
};
