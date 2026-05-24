import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Obchodní podmínky",
  "Obchodní podmínky e-shopu Korunní Byliny.",
);

const FALLBACK = `1. Úvodní ustanovení
Tyto obchodní podmínky upravují vztah mezi provozovatelem e-shopu Korunní Byliny a kupujícím při prodeji zboží prostřednictvím internetového obchodu.

2. Objednávka a uzavření smlouvy
Objednávka kupujícího je návrhem kupní smlouvy. Smlouva je uzavřena okamžikem potvrzení objednávky provozovatelem nebo zaplacením objednávky.

3. Ceny a platba
Všechny ceny jsou uvedeny včetně DPH, pokud není uvedeno jinak. Platba probíhá prostřednictvím platební brány Stripe.`;

export default function TermsPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.terms}
      fallbackTitle="Obchodní podmínky"
      fallbackDescription="Obchodní podmínky e-shopu Korunní Byliny."
      fallbackContent={FALLBACK}
    />
  );
}
