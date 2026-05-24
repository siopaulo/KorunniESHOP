"use server";

import { z } from "zod";

import { sendContactFormEmail } from "@/lib/email/send";

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
