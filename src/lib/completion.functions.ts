import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FEEDBACK_URL = "https://thevapreneursschool.com/portal?feedback=accelerator";

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function completionEmailHtml(name: string) {
  return `<div style="background:#ffffff;padding:24px;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #dbe6e1;border-radius:12px;overflow:hidden;">
    <div style="background:#0B2D48;padding:20px 24px;">
      <p style="margin:0;color:#0F8B5F;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">The VApreneurs School · The Accelerator</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-family:Georgia,serif;font-size:24px;">Congratulations, ${esc(name)}!</h1>
    </div>
    <div style="padding:22px 24px;font-family:Arial,sans-serif;color:#0C1F2E;font-size:15px;line-height:1.6;">
      <p>You have completed the 10-Day Accelerator and your VA course.</p>
      <h2 style="font-family:Georgia,serif;color:#0B2D48;font-size:20px;">Done with your VA course — now what?</h2>
      <p>You will receive your certificate from us within the next three days.</p>
      <p>In the meantime, please share feedback on how you found the classes and your experience. Your feedback helps us improve future cohorts.</p>
      <p style="margin:24px 0;"><a href="${FEEDBACK_URL}" style="background:#0F8B5F;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;">Share your feedback</a></p>
      <p style="color:#5b6b76;font-size:13px;">The VApreneurs School — Map Your Skills, Scale Your Business.</p>
    </div>
  </div>
</div>`;
}

async function sendFor(userId: string, courseSlug: string, force: boolean) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) return { sent: false, reason: "not_configured" as const };

  // Claim the send atomically so retries never email twice.
  let claim = supabaseAdmin
    .from("course_completions")
    .update({ email_sent_at: new Date().toISOString(), email_status: "sending" })
    .eq("user_id", userId)
    .eq("course_slug", courseSlug);
  if (!force) claim = claim.is("email_sent_at", null);
  const { data: rows } = await claim.select("id");
  if (!rows || rows.length === 0) return { sent: false, reason: "already_sent" as const };

  const { data: profile } = await supabaseAdmin
    .from("profiles").select("email, full_name").eq("id", userId).maybeSingle();
  if (!profile?.email) {
    await supabaseAdmin.from("course_completions").update({ email_sent_at: null, email_status: "no_email" })
      .eq("user_id", userId).eq("course_slug", courseSlug);
    return { sent: false, reason: "no_email" as const };
  }
  const from = process.env["APPLICATION_NOTIFY_FROM"] ?? "The VApreneurs School <onboarding@resend.dev>";
  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from,
      to: [profile.email],
      reply_to: "info@thevapreneursschool.com",
      subject: "Congratulations — you completed the 10-Day Accelerator!",
      html: completionEmailHtml(profile.full_name?.trim() || "VApreneur"),
    }),
  });
  if (!res.ok) {
    console.error(`[completionEmail] failed [${res.status}]: ${await res.text()}`);
    await supabaseAdmin.from("course_completions").update({ email_sent_at: null, email_status: "failed" })
      .eq("user_id", userId).eq("course_slug", courseSlug);
    return { sent: false, reason: "send_failed" as const };
  }
  await supabaseAdmin.from("course_completions").update({ email_status: "sent" })
    .eq("user_id", userId).eq("course_slug", courseSlug);
  return { sent: true as const };
}

/** Student: send my own completion email once, after the database recorded completion. */
export const sendMyCompletionEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("course_completions").select("id, email_sent_at")
      .eq("user_id", context.userId).eq("course_slug", "accelerator").maybeSingle();
    if (!data || data.email_sent_at) return { sent: false, reason: "nothing_to_send" as const };
    return sendFor(context.userId, "accelerator", false);
  });

/** Admin: resend a student's completion email. */
export const resendCompletionEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Admins only");
    return sendFor(data.userId, "accelerator", true);
  });
