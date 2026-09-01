import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOTIFY_TO = "info@thevapreneursschool.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const applicationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  experience: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(1500).optional().default(""),
  courseTitle: z.string().trim().max(200).optional().default(""),
  courseSlug: z.string().trim().max(120).optional().default(""),
  track: z.string().trim().max(40).optional().default(""),
});

type ApplicationInput = z.infer<typeof applicationSchema>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;background:#E4F3EC;color:#0B2D48;font-weight:600;font-family:Arial,sans-serif;font-size:13px;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;color:#0C1F2E;font-family:Arial,sans-serif;font-size:13px;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td>
  </tr>`;
}

function buildHtml(data: ApplicationInput) {
  return `<div style="background:#F5F8F7;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dbe6e1;">
      <div style="background:#0B2D48;padding:18px 22px;">
        <p style="margin:0;color:#0F8B5F;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">New application</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-family:Georgia,serif;font-size:22px;">${escapeHtml(data.courseTitle || "Course application")}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}
        ${row("Experience", data.experience)}
        ${row("Course", data.courseTitle)}
        ${row("Course slug", data.courseSlug)}
        ${row("Track", data.track)}
        ${row("Message", data.message)}
      </table>
      <div style="padding:16px 22px;color:#5b6b76;font-family:Arial,sans-serif;font-size:12px;">
        Submitted ${escapeHtml(new Date().toUTCString())}
      </div>
    </div>
  </div>`;
}

export const notifyApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => applicationSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const resendKey = process.env["RESEND_API_KEY"];
    const from =
      process.env["APPLICATION_NOTIFY_FROM"] ??
      "The VApreneurs School <onboarding@resend.dev>";

    if (!lovableKey || !resendKey) {
      console.error("[notifyApplication] Missing email credentials");
      return { sent: false, reason: "not_configured" as const };
    }

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from,
        to: [NOTIFY_TO],
        reply_to: data.email,
        subject: `New application: ${data.courseTitle || "course"} — ${data.name}`,
        html: buildHtml(data),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[notifyApplication] send failed [${response.status}]: ${errorBody}`);
      return { sent: false, reason: "send_failed" as const, status: response.status };
    }

    return { sent: true as const };
  });
