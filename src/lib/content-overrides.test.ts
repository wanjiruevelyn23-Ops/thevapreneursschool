import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { mergeModule, type ModuleContentRow } from "./content-overrides";
import type { CourseModule } from "@/content/types";

const base: CourseModule = {
  slug: "day-2", number: 2, title: "Ideal client", summary: "",
  lesson: [{ type: "paragraph", text: "Original lesson" }],
  quiz: [{ id: "old", question: "Original?", options: ["Yes", "No"], answerIndex: 0 }],
  resources: [{ path: "old-resource", name: "Original resource" }],
  slides: [{ path: "old-slide", name: "Original slide" }],
};
const stored: ModuleContentRow = {
  id: "saved", course_slug: "accelerator", module_slug: "day-2", title: null,
  summary: null, duration: null, lesson: [], quiz: [], notes: null,
  assignment: null, resources: [], slides: [], video_url: null, release_at: null,
  quiz_feedback: "full", published: false, updated_at: "2026-11-22T10:00:00Z",
};
describe("saved content is authoritative", () => {
  it("does not restore deleted quiz questions", () => {
    expect(mergeModule(base, stored).quiz).toEqual([]);
  });
  it("does not restore removed lesson blocks", () => {
    expect(mergeModule(base, stored).lesson).toEqual([]);
  });
  it("does not restore removed resources", () => {
    expect(mergeModule(base, stored).resources).toEqual([]);
  });
  it("does not restore removed slides", () => {
    expect(mergeModule(base, stored).slides).toEqual([]);
  });
  it("uses saved questions instead of original questions", () => {
    const quiz = [{ id: "new", question: "Best fit?", options: ["Yes", "No"], answerIndex: 0 }];
    expect(mergeModule(base, { ...stored, quiz }).quiz).toEqual(quiz);
  });
});