import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Reklamační řád",
  "Reklamační řád e-shopu Korunní Byliny.",
);

const FALLBACK = `Právo na odstoupení od smlouvy
Kupující má právo odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání důvodu.

Postup reklamace
Reklamaci uplatněte e-mailem na kontaktní adresu obchodu s popisem vady a číslem objednávky. Odpovíme do 3 pracovních dnů.

Vyřízení reklamace
Reklamace bude vyřízena nejpozději do 30 dnů od uplatnění, pokud se nedohodneme jinak.`;

export default function ReturnsPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.returns}
      fallbackTitle="Reklamační řád"
      fallbackDescription="Reklamační řád e-shopu Korunní Byliny."
      fallbackContent={FALLBACK}
    />
  );
}
