import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { ClearCartOnSuccess } from "@/components/shop/ClearCartOnSuccess";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createPageMetadata(
  "Objednávka úspěšná",
  "Děkujeme za vaši objednávku.",
);

export default function OrderSuccessPage() {
  return (
    <PageShell title="Děkujeme za objednávku!" description="Vaše objednávka byla úspěšně přijata.">
      <ClearCartOnSuccess />
      <div className="mt-8 rounded-2xl border border-sage/30 bg-sage/5 p-8 text-center">
        <p className="text-muted-foreground">
          Potvrzení objednávky vám zašleme na e-mail. Brzy se vám ozveme s dalšími informacemi.
        </p>
        <Button asChild className="mt-6">
          <Link href="/produkty">Pokračovat v nákupu</Link>
        </Button>
      </div>
    </PageShell>
  );
}
