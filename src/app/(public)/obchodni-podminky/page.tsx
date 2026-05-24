import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Obchodní podmínky",
  "Obchodní podmínky e-shopu Korunní Byliny.",
);

export default function TermsPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.terms}
      fallbackDescription="Obchodní podmínky e-shopu Korunní Byliny."
    />
  );
}
