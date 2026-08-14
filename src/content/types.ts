/**
 * Content data model for The VApreneurs School LMS.
 *
 * New modules, quizzes and notes are added as DATA in src/content/modules/*.ts —
 * never hardcoded into components. Everything below is plain serializable data
 * so a new module can be dropped in by appending one object to a course's
 * `modules` array.
 */

export type LessonBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string };

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
  explanation?: string;
};

/**
 * Original, unedited source notes for a module. `paragraphs` is rendered in the
 * portal "Notes" toggle and is also what gets packaged into the downloadable
 * Word document, so no separate file upload is needed.
 */
export type ModuleNotes = {
  title: string;
  fileName: string;
  paragraphs: string[];
};

/** Practical work handed in after the lesson. Drop one in per module as content lands. */
export type ModuleAssignment = {
  title: string;
  intro?: string;
  tasks: string[];
  deliverable?: string;
  /** Optional guidance on how the work is judged. */
  criteria?: string[];
};

export type CourseModule = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  /** Estimated study time, e.g. "45 min". */
  duration?: string;
  /** Empty array = content not published yet; the portal shows a placeholder. */
  lesson: LessonBlock[];
  /** Empty array = no quiz yet; the module can be marked complete directly. */
  quiz: QuizQuestion[];
  notes?: ModuleNotes;
  assignment?: ModuleAssignment;
};


export type CourseCategory = "skill" | "toolkit";

export type Course = {
  slug: string;
  title: string;
  /** Which waypoint of the route map this course belongs to. */
  waypoint: 1 | 2 | 3;
  category: CourseCategory;
  eyebrow: string;
  tagline: string;
  description: string;
  outcomes: string[];
  /** Skill tracks offer an added-coaching option; toolkits are self-taught only. */
  coaching: boolean;
  modules: CourseModule[];
};

export type TrackKey = "self" | "coaching";

export const TRACK_LABEL: Record<TrackKey, string> = {
  self: "Self-taught",
  coaching: "With coaching",
};

/** Helper for modules whose content is still being written. */
export function placeholderModule(
  number: number,
  title: string,
  summary: string,
): CourseModule {
  return {
    slug: `module-${number}`,
    number,
    title,
    summary,
    lesson: [],
    quiz: [],
  };
}
