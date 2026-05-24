import Link from "next/link";
import { Instagram, Leaf, Mail, MapPin, Phone } from "lucide-react";

import { footerLinks, siteConfig } from "@/config/site";
import { CookieSettingsLink } from "@/components/shared/CookieSettingsLink";
import { Separator } from "@/components/ui/separator";
import { getSiteSettings } from "@/lib/data/content";

export async function Footer() {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  const shopName = settings?.shop_name ?? siteConfig.name;
  const email = settings?.shop_email ?? siteConfig.contact.email;
  const phone = settings?.phone || siteConfig.contact.phone;
  const address = settings?.address || siteConfig.contact.address;
  const social = (settings?.social_links ?? {}) as Record<string, string>;
  const instagram = social.instagram ?? siteConfig.social.instagram;

  const operatorLines = [
    settings?.ico ? `IČO: ${settings.ico}` : null,
    settings?.dic ? `DIČ: ${settings.dic}` : null,
  ].filter(Boolean);

  return (
    <footer className="border-t border-border/60 bg-moss text-primary-foreground">
      <div className="container-wide section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-sage-light" aria-hidden="true" />
              <span className="font-display text-lg font-semibold">{shopName}</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {siteConfig.tagline}. Ručně vyráběné produkty s láskou k přírodě a tradici.
            </p>
            {operatorLines.length > 0 ? (
              <p className="text-xs text-primary-foreground/70">{operatorLines.join(" · ")}</p>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-sage-light">
              Obchod
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-sage-light">
              Informace
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-sage-light">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-light" aria-hidden="true" />
                {address}
              </li>
              {phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-sage-light" aria-hidden="true" />
                  <a href={`tel:${phone}`} className="hover:text-primary-foreground">
                    {phone}
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-sage-light" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-primary-foreground">
                  {email}
                </a>
              </li>
            </ul>
            {instagram ? (
              <div className="mt-4 flex gap-3">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © {currentYear} {shopName}. Všechna práva vyhrazena.
          </p>
          <CookieSettingsLink className="text-center hover:text-primary-foreground" />
        </div>
      </div>
    </footer>
  );
}
