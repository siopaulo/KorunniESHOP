import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Ochrana osobních údajů",
  "Zásady ochrany osobních údajů e-shopu Korunní Byliny (GDPR).",
);

const FALLBACK = `Správce osobních údajů
Správcem osobních údajů je provozovatel e-shopu Korunní Byliny. Kontaktní údaje naleznete v sekci Kontakt.

Jaké údaje zpracováváme
Jméno, e-mail, telefon, dodací a fakturační adresa, údaje o objednávkách a platbách.

Právní základ zpracování
Plnění smlouvy, oprávněný zájem, souhlas (marketing, cookies) a plnění právních povinností.

Vaše práva
Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost údajů a podání stížnosti u ÚOOÚ.`;

export default function PrivacyPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.privacy}
      fallbackTitle="Ochrana osobních údajů"
      fallbackDescription="Zásady ochrany osobních údajů e-shopu Korunní Byliny (GDPR)."
      fallbackContent={FALLBACK}
    />
  );
}
