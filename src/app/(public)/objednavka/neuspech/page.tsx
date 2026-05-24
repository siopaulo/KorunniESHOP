import Link from "next/link";

import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata(
  "Platba neúspěšná",
  "Platbu se nepodařilo dokončit.",
);

export default function OrderFailurePage() {
  return (
    <PageShell
      title="Platba se nezdařila"
      description="Platbu se nepodařilo dokončit. Zkuste to prosím znovu."
    >
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/pokladna">Zkusit znovu</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/kontakt">Kontaktovat nás</Link>
        </Button>
      </div>
    </PageShell>
  );
}
