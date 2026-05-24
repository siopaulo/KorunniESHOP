import Link from "next/link";

import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { WITHDRAWAL_FORM_CONTENT } from "@/lib/legal/default-content";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata(
  "Formulář odstoupení od smlouvy",
  "Vzorový formulář pro odstoupení od kupní smlouvy v e-shopu Korunní Byliny.",
);

export default function WithdrawalFormPage() {
  return (
    <PageShell
      title="Formulář odstoupení od smlouvy"
      description="Vyplňte údaje a odešlete nám formulář e-mailem nebo poštou."
    >
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
            {WITHDRAWAL_FORM_CONTENT}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Formulář můžete vytisknout, doplnit a zaslat na kontaktní adresu uvedenou v textu, nebo
          nám stejné údaje pošlete e-mailem. Podrobnosti o odstoupení najdete na stránce{" "}
          <Link href="/odstoupeni-od-smlouvy" className="text-sage underline">
            Odstoupení od smlouvy
          </Link>
          .
        </p>
        <Button asChild variant="outline">
          <Link href="/odstoupeni-od-smlouvy">← Zpět na informace o odstoupení</Link>
        </Button>
      </div>
    </PageShell>
  );
}
