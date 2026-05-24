import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Obchodní podmínky",
  "Obchodní podmínky e-shopu Korunní Byliny.",
);

export default function TermsPage() {
  return (
    <PageShell title="Obchodní podmínky">
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-8">
        <p className="rounded-lg bg-accent/10 p-4 text-sm font-medium text-earth">
          ⚠️ Tento text je šablona. Finální znění musí schválit právník nebo účetní před
          spuštěním e-shopu.
        </p>
        <h2 className="font-display text-xl font-semibold">1. Úvodní ustanovení</h2>
        <p>
          Tyto obchodní podmínky upravují vztah mezi provozovatelem e-shopu Korunní Byliny a
          kupujícím při prodeji zboží prostřednictvím internetového obchodu.
        </p>
        <h2 className="font-display text-xl font-semibold">2. Objednávka a uzavření smlouvy</h2>
        <p>
          Objednávka kupujícího je návrhem kupní smlouvy. Smlouva je uzavřena okamžikem
          potvrzení objednávky provozovatelem nebo zaplacením objednávky.
        </p>
        <h2 className="font-display text-xl font-semibold">3. Ceny a platba</h2>
        <p>
          Všechny ceny jsou uvedeny včetně DPH, pokud není uvedeno jinak. Platba probíhá
          prostřednictvím platební brány Stripe.
        </p>
      </div>
    </PageShell>
  );
}
