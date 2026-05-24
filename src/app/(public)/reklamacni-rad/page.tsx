import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Reklamační řád",
  "Reklamační řád e-shopu Korunní Byliny.",
);

export default function ReturnsPage() {
  return (
    <PageShell title="Reklamační řád">
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-8">
        <p className="rounded-lg bg-accent/10 p-4 text-sm font-medium text-earth">
          ⚠️ Tento text je šablona. Finální znění musí schválit právník před spuštěním e-shopu.
        </p>
        <h2>Právo na odstoupení od smlouvy</h2>
        <p>
          Kupující má právo odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání důvodu.
        </p>
        <h2>Postup reklamace</h2>
        <p>
          Reklamaci uplatněte e-mailem na kontaktní adresu obchodu s popisem vady a číslem
          objednávky. Odpovíme do 3 pracovních dnů.
        </p>
        <h2>Vyřízení reklamace</h2>
        <p>
          Reklamace bude vyřízena nejpozději do 30 dnů od uplatnění, pokud se nedohodneme jinak.
        </p>
      </div>
    </PageShell>
  );
}
