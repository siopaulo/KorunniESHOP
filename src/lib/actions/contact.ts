"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { sendContactFormEmail } from "@/lib/email/send";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Neplatný e-mail"),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
});

export type ContactActionResult = { error?: string; success?: string };

export async function submitContactAction(
  _prev: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rate = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rate.success) {
    return { error: "Příliš mnoho zpráv. Zkuste to prosím za chvíli." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Nevalidní data" };
  }

  try {
    await sendContactFormEmail(parsed.data);
    return { success: "Zpráva byla odeslána. Brzy se vám ozveme." };
  } catch {
    return { error: "Odeslání se nezdařilo. Zkuste to prosím později." };
  }
}
