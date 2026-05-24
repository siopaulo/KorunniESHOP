import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";

export const metadata = createLegalMetadata(
  "Cookies",
  "Informace o používání cookies na webu Korunní Byliny.",
);

const FALLBACK = `Co jsou cookies
Cookies jsou malé textové soubory ukládané do vašeho prohlížeče, které pomáhají webu fungovat správně a zlepšují uživatelský zážitek.

Typy cookies
- Nezbytné — nutné pro fungování košíku a checkoutu
- Analytické — pomáhají pochopit, jak web používáte (vyžadují souhlas)
- Marketingové — pro personalizaci reklam (vyžadují souhlas)

Správa souhlasů
Svůj souhlas můžete kdykoli změnit prostřednictvím cookie lišty nebo nastavení prohlížeče.`;

export default function CookiesPage() {
  return (
    <LegalPageView
      slug={LEGAL_SLUGS.cookies}
      fallbackTitle="Zásady používání cookies"
      fallbackDescription="Informace o používání cookies na webu Korunní Byliny."
      fallbackContent={FALLBACK}
    />
  );
}
