import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/config/site";
import { isEmailConfigured } from "@/lib/email/send";

const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "objednavky@korunni-byliny.cz";

export interface AdminMailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface AdminMailResult {
  sent: boolean;
  error?: string;
}

export async function sendAdminEmail(payload: AdminMailPayload): Promise<AdminMailResult> {
  if (!isEmailConfigured()) {
    return {
      sent: false,
      error: "E-mail provider není nakonfigurován (chybí RESEND_API_KEY).",
    };
  }

  const key = process.env.RESEND_API_KEY!;
  const resend = new Resend(key);

  try {
    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${fromEmail}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    return { sent: false, error: (err as Error).message };
  }
}

export function wrapAdminMailHtml(body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `
    <div style="font-family: Georgia, serif; color: #2c2c2c; line-height: 1.6;">
      <p style="margin: 0 0 1em;">${escaped}</p>
      <p style="margin: 1.5em 0 0; color: #6b6560; font-size: 14px;">${siteConfig.name}</p>
    </div>
  `;
}
