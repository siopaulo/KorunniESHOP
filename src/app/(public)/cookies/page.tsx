import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Cookies",
  "Informace o používání cookies na webu Korunní Byliny.",
);

export default function CookiesPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.cookies}
      fallbackDescription="Informace o používání cookies na webu Korunní Byliny."
    />
  );
}
