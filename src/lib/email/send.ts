import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "objednavky@korunni-byliny.cz";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: number;
  items: { name: string; quantity: number; totalPrice: number }[];
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const client = getResend();
  if (!client) {
    console.warn("[email] Resend not configured, skipping order confirmation");
    return;
  }

  const itemsHtml = data.items
    .map(
      (i) =>
        `<li>${i.name} × ${i.quantity} — ${formatPrice(i.totalPrice)}</li>`,
    )
    .join("");

  await client.emails.send({
    from: `${siteConfig.name} <${fromEmail}>`,
    to: data.customerEmail,
    subject: `Potvrzení objednávky ${data.orderNumber}`,
    html: `
      <h1>Děkujeme za objednávku!</h1>
      <p>Vážená/ý ${data.customerName},</p>
      <p>Vaše objednávka <strong>${data.orderNumber}</strong> byla přijata a zaplacena.</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Celkem: ${formatPrice(data.total)}</strong></p>
      <p>S pozdravem,<br>${siteConfig.name}</p>
    `,
  });
}

export async function sendOrderAdminNotificationEmail(data: OrderEmailData) {
  const client = getResend();
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.RESEND_FROM_EMAIL;
  if (!client || !adminEmail) {
    console.warn("[email] Resend/admin email not configured");
    return;
  }

  await client.emails.send({
    from: `${siteConfig.name} <${fromEmail}>`,
    to: adminEmail,
    subject: `Nová objednávka ${data.orderNumber}`,
    html: `
      <h1>Nová objednávka</h1>
      <p>Číslo: <strong>${data.orderNumber}</strong></p>
      <p>Zákazník: ${data.customerName} (${data.customerEmail})</p>
      <p>Celkem: ${formatPrice(data.total)}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/objednavky">Otevřít v administraci</a></p>
    `,
  });
}

export async function sendOrderShippedEmail(
  data: Pick<OrderEmailData, "orderNumber" | "customerEmail" | "customerName">,
) {
  const client = getResend();
  if (!client) return;

  await client.emails.send({
    from: `${siteConfig.name} <${fromEmail}>`,
    to: data.customerEmail,
    subject: `Objednávka ${data.orderNumber} byla odeslána`,
    html: `
      <p>Vážená/ý ${data.customerName},</p>
      <p>Vaše objednávka <strong>${data.orderNumber}</strong> byla odeslána.</p>
      <p>${siteConfig.name}</p>
    `,
  });
}

export async function sendContactFormEmail(input: {
  name: string;
  email: string;
  message: string;
}) {
  const client = getResend();
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.RESEND_FROM_EMAIL;
  if (!client || !adminEmail) return;

  await client.emails.send({
    from: `${siteConfig.name} <${fromEmail}>`,
    to: adminEmail,
    replyTo: input.email,
    subject: `Kontakt: ${input.name}`,
    html: `<p>Od: ${input.name} (${input.email})</p><p>${input.message}</p>`,
  });
}
