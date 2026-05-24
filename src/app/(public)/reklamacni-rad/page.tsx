import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Reklamační řád",
  "Reklamační řád e-shopu Korunní Byliny.",
);

export default function ReturnsPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.returns}
      fallbackDescription="Reklamační řád e-shopu Korunní Byliny."
    />
  );
}
