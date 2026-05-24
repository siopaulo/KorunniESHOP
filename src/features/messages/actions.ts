"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit/log";
import { sendAdminEmail, wrapAdminMailHtml } from "@/lib/email/admin-mail";
import { sendContactFormEmail } from "@/lib/email/send";
import { canManageOrders, requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  contactSubmitSchema,
  messageStatusUpdateSchema,
  replyInputSchema,
  type ContactMessageStatus,
} from "@/features/messages/schema";

export type MessageActionResult = { error?: string; success?: string; providerWarning?: string };

export async function submitContactAction(
  _prev: MessageActionResult,
  formData: FormData,
): Promise<MessageActionResult> {
  const { headers } = await import("next/headers");
  const { checkRateLimit } = await import("@/lib/rate-limit");

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rate = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rate.success) {
    return { error: "Příliš mnoho zpráv. Zkuste to prosím za chvíli." };
  }

  const parsed = contactSubmitSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    gdprConsent: formData.get("gdprConsent") === "on" ? true : undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
      gdpr_consent: true,
      status: "new",
      source: "contact_form",
    });

    if (error) {
      console.error("[submitContactAction]", error.message);
    }
  }

  try {
    await sendContactFormEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
  } catch {
    // e-mail je volitelný bez klíče
  }

  return { success: "Zpráva byla odeslána. Brzy se vám ozveme." };
}

export async function updateMessageStatusAction(
  _prev: MessageActionResult,
  formData: FormData,
): Promise<MessageActionResult> {
  const session = await requireAuth();
  if (!canManageOrders(session.role) && session.role !== "admin") {
    return { error: "Nemáte oprávnění" };
  }

  const parsed = messageStatusUpdateSchema.safeParse({
    messageId: formData.get("messageId"),
    status: formData.get("status"),
    internalNote: formData.get("internalNote") || undefined,
  });

  if (!parsed.success) return { error: "Nevalidní data" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({
      status: parsed.data.status,
      internal_note: parsed.data.internalNote ?? null,
    })
    .eq("id", parsed.data.messageId);

  if (error) return { error: error.message };

  await writeAuditLog({
    userId: session.userId,
    action: "message.status_update",
    entityType: "contact_messages",
    entityId: parsed.data.messageId,
    metadata: { status: parsed.data.status },
  });

  revalidatePath("/admin/zpravy");
  return { success: "Stav zprávy aktualizován" };
}

export async function replyToMessageAction(input: {
  messageId: string;
  subject: string;
  body: string;
  templateKey?: string;
}): Promise<{ ok: boolean; error?: string; providerWarning?: string }> {
  const session = await requireAuth();
  if (!canManageOrders(session.role) && session.role !== "admin") {
    return { ok: false, error: "Nemáte oprávnění" };
  }

  const parsed = replyInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Nevalidní data" };

  const supabase = await createClient();
  const { data: message, error: fetchError } = await supabase
    .from("contact_messages")
    .select("id, email, subject")
    .eq("id", parsed.data.messageId)
    .single();

  if (fetchError || !message) return { ok: false, error: "Zpráva nenalezena" };

  const html = wrapAdminMailHtml(parsed.data.body);
  const mailResult = await sendAdminEmail({
    to: message.email,
    subject: parsed.data.subject,
    html,
  });

  const now = new Date().toISOString();

  await supabase.from("contact_message_replies").insert({
    contact_message_id: message.id,
    to_email: message.email,
    subject: parsed.data.subject,
    body: parsed.data.body,
    sent_at: mailResult.sent ? now : null,
    provider: "resend",
    provider_error: mailResult.error ?? null,
    created_by: session.userId,
  });

  await supabase.from("mail_log").insert({
    contact_message_id: message.id,
    to_email: message.email,
    subject: parsed.data.subject,
    body: parsed.data.body,
    template_key: parsed.data.templateKey ?? null,
    status: mailResult.sent ? "sent" : "draft",
    provider: "resend",
    provider_error: mailResult.error ?? null,
    created_by: session.userId,
  });

  if (mailResult.sent) {
    await supabase
      .from("contact_messages")
      .update({ status: "resolved" satisfies ContactMessageStatus })
      .eq("id", message.id);
  }

  await writeAuditLog({
    userId: session.userId,
    action: "message.reply",
    entityType: "contact_messages",
    entityId: message.id,
    metadata: { sent: mailResult.sent },
  });

  revalidatePath("/admin/zpravy");

  if (!mailResult.sent) {
    return {
      ok: true,
      providerWarning:
        mailResult.error ?? "E-mail provider není nakonfigurován. Odpověď byla uložena jako draft.",
    };
  }

  return { ok: true };
}

export async function deleteMessageAction(id: string): Promise<MessageActionResult> {
  const session = await requireAuth();
  if (!canManageOrders(session.role) && session.role !== "admin") {
    return { error: "Nemáte oprávnění" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/zpravy");
  return { success: "Zpráva smazána" };
}
