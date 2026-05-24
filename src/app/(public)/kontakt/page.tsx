import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { ContactForm } from "@/components/shop/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata(
  "Kontakt",
  "Kontaktujte nás — Korunní Byliny, Praha.",
);

export default function ContactPage() {
  return (
    <PageShell
      title="Kontakt"
      description="Máte dotaz? Napište nám nebo nás navštivte v Korunní."
    >
      <div className="mt-6 space-y-2 text-muted-foreground">
        <p>{siteConfig.contact.address}</p>
        <p>
          <a href={`tel:${siteConfig.contact.phone}`} className="text-sage hover:text-moss">
            {siteConfig.contact.phone}
          </a>
        </p>
        <p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-sage hover:text-moss"
          >
            {siteConfig.contact.email}
          </a>
        </p>
      </div>
      <ContactForm />
    </PageShell>
  );
}
