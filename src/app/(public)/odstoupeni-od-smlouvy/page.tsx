import {
  createLegalMetadata,
  LegalPageView,
  LEGAL_SLUGS,
} from "@/components/shared/LegalPageView";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createLegalMetadata(
  "Odstoupení od smlouvy",
  "Informace o právu odstoupit od kupní smlouvy ve 14denní lhůtě.",
);

export default function WithdrawalPage() {
  return (
    <div>
      <LegalPageView
        slug={LEGAL_SLUGS.withdrawal}
        fallbackDescription="Informace o právu odstoupit od kupní smlouvy ve 14denní lhůtě."
      />
      <div className="container-narrow pb-16">
        <div className="-mt-2 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <p className="text-sm text-muted-foreground">
            Chcete od smlouvy odstoupit? Vyplňte vzorový formulář nebo nám pošlete e-mail.
          </p>
          <Button asChild className="mt-4">
            <Link href="/odstoupeni-od-smlouvy/formular">Vzorový formulář odstoupení</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
