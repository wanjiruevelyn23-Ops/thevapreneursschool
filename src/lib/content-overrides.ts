/**
 * Instructor-managed course content.
 *
 * Built-in course material lives in src/content/*. Anything the instructor edits
 * in /admin/instructor is stored in the `module_content` table and overlaid on
 * top of the built-in data at read time, so the portal always shows the latest
 * published version without a code change.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COURSES } from "@/content/courses";
import type {
  Course,
  CourseModule,
  LessonBlock,
  ModuleAssignment,
  ModuleNotes,
  ModuleResource,
  QuizQuestion,
} from "@/content/types";

export type ModuleContentRow = {
  id: string;
  course_slug: string;
  module_slug: string;
  title: string | null;
  summary: string | null;
  duration: string | null;
  lesson: LessonBlock[];
  notes: ModuleNotes | null;
  quiz: QuizQuestion[];
  assignment: ModuleAssignment | null;
  resources: ModuleResource[];
  published: boolean;
  updated_at: string;
};


export type OverrideMap = Map<string, ModuleContentRow>;

export const overrideKey = (courseSlug: string, moduleSlug: string) =>
  `${courseSlug}::${moduleSlug}`;

function toRow(raw: Record<string, unknown>): ModuleContentRow {
  return {
    id: String(raw['id']),
    course_slug: String(raw['course_slug']),
    module_slug: String(raw['module_slug']),
    title: (raw['title'] as string | null) ?? null,
    summary: (raw['summary'] as string | null) ?? null,
    duration: (raw['duration'] as string | null) ?? null,
    lesson: (raw['lesson'] as LessonBlock[] | null) ?? [],
    notes: (raw['notes'] as ModuleNotes | null) ?? null,
    quiz: (raw['quiz'] as QuizQuestion[] | null) ?? [],
    assignment: (raw['assignment'] as ModuleAssignment | null) ?? null,
    published: Boolean(raw['published']),
    updated_at: String(raw['updated_at'] ?? ""),
  };
}

/** Merge one stored row over the built-in module data. */
export function mergeModule(
  base: CourseModule,
  row: ModuleContentRow | undefined,
): CourseModule {
  if (!row) return base;
  const merged: CourseModule = {
    ...base,
    title: row.title?.trim() ? row.title : base.title,
    summary: row.summary?.trim() ? row.summary : base.summary,
    lesson: row.lesson.length ? row.lesson : base.lesson,
    quiz: row.quiz.length ? row.quiz : base.quiz,
  };
  const duration = row.duration?.trim() ? row.duration : base.duration;
  if (duration) merged.duration = duration;
  const notes = row.notes ?? base.notes;
  if (notes) merged.notes = notes;
  const assignment = row.assignment ?? base.assignment;
  if (assignment) merged.assignment = assignment;
  return merged;
}

export function mergeCourses(overrides: OverrideMap): Course[] {
  if (overrides.size === 0) return COURSES;
  return COURSES.map((course) => ({
    ...course,
    modules: course.modules.map((module) =>
      mergeModule(module, overrides.get(overrideKey(course.slug, module.slug))),
    ),
  }));
}

/**
 * Fetches stored module content. Students only ever receive published rows
 * (enforced by row-level security); instructors also see their drafts.
 */
export function useModuleOverrides(userId: string | undefined) {
  const [rows, setRows] = useState<ModuleContentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("module_content")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      setRows((data as unknown as Record<string, unknown>[]).map(toRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void load();
  }, [userId, load]);

  const map = useMemo(() => {
    const next: OverrideMap = new Map();
    for (const row of rows) next.set(overrideKey(row.course_slug, row.module_slug), row);
    return next;
  }, [rows]);

  return { rows, map, loading, reload: load };
}

/** Built-in + published/draft content merged, for use anywhere in the portal. */
export function useCourses(userId: string | undefined) {
  const { map, loading, reload } = useModuleOverrides(userId);
  const courses = useMemo(() => mergeCourses(map), [map]);
  return { courses, overrides: map, loading, reload };
}
