import Link from "next/link";
import { Instagram, Leaf, Mail, MapPin, Phone } from "lucide-react";

import { footerLinks, siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-moss text-primary-foreground">
      <div className="container-wide section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-sage-light" aria-hidden="true" />
              <span className="font-display text-lg font-semibold">{siteConfig.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {siteConfig.tagline}. Ručně vyráběné produkty s láskou k přírodě a tradici.
            </p>
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
                {siteConfig.contact.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-sage-light" aria-hidden="true" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-primary-foreground">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-sage-light" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-primary-foreground"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © {currentYear} {siteConfig.name}. Všechna práva vyhrazena.
          </p>
          <p className="text-center italic">
            ⚠️ Právní texty jsou šablony — finální znění musí schválit právník.
          </p>
        </div>
      </div>
    </footer>
  );
}
