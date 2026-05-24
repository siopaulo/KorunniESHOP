import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Ochrana osobních údajů",
  "Zásady ochrany osobních údajů e-shopu Korunní Byliny (GDPR).",
);

export default function PrivacyPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.privacy}
      fallbackDescription="Zásady ochrany osobních údajů e-shopu Korunní Byliny (GDPR)."
    />
  );
}
