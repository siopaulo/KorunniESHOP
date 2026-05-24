import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Ochrana osobních údajů",
  "Zásady ochrany osobních údajů e-shopu Korunní Byliny (GDPR).",
);

export default function PrivacyPage() {
  return (
    <PageShell title="Ochrana osobních údajů">
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-8">
        <p className="rounded-lg bg-accent/10 p-4 text-sm font-medium text-earth">
          ⚠️ Tento text je šablona. Finální znění musí schválit právník před spuštěním e-shopu.
        </p>
        <h2>Správce osobních údajů</h2>
        <p>
          Správcem osobních údajů je provozovatel e-shopu Korunní Byliny. Kontaktní údaje
          naleznete v sekci Kontakt.
        </p>
        <h2>Jaké údaje zpracováváme</h2>
        <p>
          Jméno, e-mail, telefon, dodací a fakturační adresa, údaje o objednávkách a platbách.
        </p>
        <h2>Právní základ zpracování</h2>
        <p>
          Plnění smlouvy, oprávněný zájem, souhlas (marketing, cookies) a plnění právních
          povinností.
        </p>
        <h2>Vaše práva</h2>
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost údajů a
          podání stížnosti u ÚOOÚ.
        </p>
      </div>
    </PageShell>
  );
}
