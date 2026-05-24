import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Cookies",
  "Informace o používání cookies na webu Korunní Byliny.",
);

export default function CookiesPage() {
  return (
    <PageShell title="Zásady používání cookies">
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-8">
        <p className="rounded-lg bg-accent/10 p-4 text-sm font-medium text-earth">
          ⚠️ Tento text je šablona. Finální znění musí schválit právník před spuštěním e-shopu.
        </p>
        <h2>Co jsou cookies</h2>
        <p>
          Cookies jsou malé textové soubory ukládané do vašeho prohlížeče, které pomáhají webu
          fungovat správně a zlepšují uživatelský zážitek.
        </p>
        <h2>Typy cookies</h2>
        <ul>
          <li>
            <strong>Nezbytné</strong> — nutné pro fungování košíku a checkoutu
          </li>
          <li>
            <strong>Analytické</strong> — pomáhají pochopit, jak web používáte (vyžadují souhlas)
          </li>
          <li>
            <strong>Marketingové</strong> — pro personalizaci reklam (vyžadují souhlas)
          </li>
        </ul>
        <h2>Správa souhlasů</h2>
        <p>
          Svůj souhlas můžete kdykoli změnit prostřednictvím cookie lišty nebo nastavení
          prohlížeče.
        </p>
      </div>
    </PageShell>
  );
}
