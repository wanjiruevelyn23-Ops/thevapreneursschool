import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Course, TrackKey } from "@/content/types";

export type Enrollment = {
  id: string;
  course_slug: string;
  track: TrackKey;
  created_at: string;
};

export type ProgressRow = {
  id: string;
  course_slug: string;
  module_slug: string;
  completed: boolean;
  score: number | null;
  total: number | null;
};

export function useEnrollments(userId: string | undefined) {
  return useQuery({
    queryKey: ["enrollments", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Enrollment[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, course_slug, track, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Enrollment[];
    },
  });
}

export function useProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["module_progress", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ProgressRow[]> => {
      const { data, error } = await supabase
        .from("module_progress")
        .select("id, course_slug, module_slug, completed, score, total");
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });
}

export function useEnroll(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseSlug,
      track,
    }: {
      courseSlug: string;
      track: TrackKey;
    }) => {
      if (!userId) throw new Error("You need to be signed in to enrol.");
      const { error } = await supabase
        .from("enrollments")
        .upsert(
          { user_id: userId, course_slug: courseSlug, track },
          { onConflict: "user_id,course_slug" },
        );
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["enrollments", userId] }),
  });
}

export function useCompleteModule(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseSlug,
      moduleSlug,
      score,
      total,
    }: {
      courseSlug: string;
      moduleSlug: string;
      score: number | null;
      total: number | null;
    }) => {
      if (!userId) throw new Error("You need to be signed in.");
      const { error } = await supabase.from("module_progress").upsert(
        {
          user_id: userId,
          course_slug: courseSlug,
          module_slug: moduleSlug,
          completed: true,
          score,
          total,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug,module_slug" },
      );
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["module_progress", userId] }),
  });
}

export function useResetProgress(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseSlug?: string) => {
      if (!userId) throw new Error("You need to be signed in.");
      let query = supabase.from("module_progress").delete().eq("user_id", userId);
      if (courseSlug) query = query.eq("course_slug", courseSlug);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["module_progress", userId] }),
  });
}

/** Sequential-unlock state for one course. */
export function courseState(course: Course, progress: ProgressRow[]) {
  const completed = new Set(
    progress
      .filter((row) => row.course_slug === course.slug && row.completed)
      .map((row) => row.module_slug),
  );
  const modules = course.modules.map((module, index) => ({
    module,
    index,
    isCompleted: completed.has(module.slug),
  }));

  // First module that isn't complete is the current one; everything after locks.
  const firstIncomplete = modules.findIndex((m) => !m.isCompleted);
  const currentIndex = firstIncomplete === -1 ? course.modules.length : firstIncomplete;

  return {
    completedCount: completed.size,
    total: course.modules.length,
    percent: course.modules.length
      ? Math.round((completed.size / course.modules.length) * 100)
      : 0,
    currentIndex,
    isFinished: currentIndex >= course.modules.length,
    modules: modules.map((m) => ({
      ...m,
      isUnlocked: m.index <= currentIndex,
      isCurrent: m.index === currentIndex,
    })),
  };
}
