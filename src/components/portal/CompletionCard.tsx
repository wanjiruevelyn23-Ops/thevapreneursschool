import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendMyCompletionEmail } from "@/lib/completion.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Shown once a student finishes all ten Accelerator days; collects private feedback. */
export function CompletionCard({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const sendEmail = useServerFn(sendMyCompletionEmail);
  const q = useQuery({
    queryKey: ["completion", userId],
    queryFn: async () => {
      const [c, f] = await Promise.all([
        supabase.from("course_completions").select("completed_at, email_sent_at")
          .eq("user_id", userId).eq("course_slug", "accelerator").maybeSingle(),
        supabase.from("course_feedback").select("id")
          .eq("user_id", userId).eq("course_slug", "accelerator").maybeSingle(),
      ]);
      return { completion: c.data, hasFeedback: Boolean(f.data) };
    },
  });
  const completion = q.data?.completion;
  useEffect(() => {
    if (completion && !completion.email_sent_at) void sendEmail().catch(() => undefined);
  }, [completion, sendEmail]);

  const [rating, setRating] = useState(0);
  const [useful, setUseful] = useState("");
  const [improve, setImprove] = useState("");
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);

  if (!completion) return null;

  async function submit() {
    if (!rating) return void toast.error("Please choose a rating.");
    setBusy(true);
    const { error } = await supabase.from("course_feedback").insert({
      user_id: userId, course_slug: "accelerator", rating,
      most_useful: useful.trim() || null, improve: improve.trim() || null, comments: comments.trim() || null,
    });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Thank you for your feedback!");
    void qc.invalidateQueries({ queryKey: ["completion", userId] });
  }

  return (
    <section id="feedback" className="surface-card mb-8 p-6">
      <div className="flex items-start gap-3">
        <Award className="mt-1 h-6 w-6 shrink-0 text-accent-deep" />
        <div>
          <h2 className="text-2xl text-primary">Congratulations — you completed the 10-Day Accelerator!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your certificate will reach you from us within three days of{" "}
            {new Date(completion.completed_at).toLocaleDateString(undefined, { dateStyle: "medium" })}.
          </p>
        </div>
      </div>
      {q.data?.hasFeedback ? (
        <p className="mt-5 rounded-md bg-mint px-4 py-3 text-sm text-primary">
          Thank you — we've received your feedback on the classes and your experience.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold text-primary">How did you find the classes and the experience?</p>
          <div className="flex gap-1" role="radiogroup" aria-label="Overall rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} out of 5`} onClick={() => setRating(n)}>
                <Star className={cn("h-7 w-7", n <= rating ? "fill-accent text-accent" : "text-muted-foreground")} />
              </button>
            ))}
          </div>
          <Textarea maxLength={3000} placeholder="What did you find most useful?" value={useful} onChange={(e) => setUseful(e.target.value)} />
          <Textarea maxLength={3000} placeholder="What could we improve?" value={improve} onChange={(e) => setImprove(e.target.value)} />
          <Textarea maxLength={3000} placeholder="Anything else about the classes or your experience?" value={comments} onChange={(e) => setComments(e.target.value)} />
          <Button variant="brand" disabled={busy} onClick={() => void submit()}>Send feedback</Button>
        </div>
      )}
    </section>
  );
}
