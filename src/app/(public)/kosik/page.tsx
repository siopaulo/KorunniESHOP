import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { CartView } from "@/components/shop/CartView";

export const metadata = createPageMetadata("Košík", "Váš nákupní košík.");

export default function CartPage() {
  return (
    <PageShell title="Košík" description="Přehled vybraných produktů před dokončením objednávky.">
      <CartView />
    </PageShell>
  );
}
