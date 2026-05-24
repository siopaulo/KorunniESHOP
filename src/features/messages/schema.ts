import { z } from "zod";

export const contactMessageStatusSchema = z.enum([
  "new",
  "in_progress",
  "resolved",
  "archived",
]);

export const contactSubmitSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Neplatný e-mail"),
  phone: z.string().max(30).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "Souhlas se zpracováním údajů je povinný" }),
  }),
});

export const replyInputSchema = z.object({
  messageId: z.string().uuid(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  templateKey: z.string().optional(),
});

export const messageStatusUpdateSchema = z.object({
  messageId: z.string().uuid(),
  status: contactMessageStatusSchema,
  internalNote: z.string().max(5000).optional(),
});

export type ContactMessageStatus = z.infer<typeof contactMessageStatusSchema>;

export const MAIL_TEMPLATES = {
  customer_reply: {
    label: "Odpověď zákazníkovi",
    subject: "Re: Vaše zpráva",
    body: "Dobrý den,\n\nděkujeme za Vaši zprávu.\n\n\nS pozdravem,\nKorunní Byliny",
  },
  order_info: {
    label: "Informace k objednávce",
    subject: "Informace k Vaší objednávce",
    body: "Dobrý den,\n\nk Vaší objednávce Vám zasíláme následující informace:\n\n\nS pozdravem,\nKorunní Byliny",
  },
  complaint: {
    label: "Reklamace",
    subject: "Re: Vaše reklamace",
    body: "Dobrý den,\n\nobdrželi jsme Vaši reklamaci a budeme ji vyřizovat v zákonné lhůtě.\n\n\nS pozdravem,\nKorunní Byliny",
  },
  general: {
    label: "Obecná odpověď",
    subject: "Re: Váš dotaz",
    body: "Dobrý den,\n\n\nS pozdravem,\nKorunní Byliny",
  },
} as const;

export type MailTemplateKey = keyof typeof MAIL_TEMPLATES;
