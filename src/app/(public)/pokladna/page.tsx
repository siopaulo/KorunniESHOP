import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata = createPageMetadata(
  "Pokladna",
  "Dokončete svou objednávku bezpečně a rychle.",
);

export default function CheckoutPage() {
  return (
    <PageShell title="Pokladna" description="Vyplňte dodací údaje a dokončete objednávku.">
      <CheckoutForm />
    </PageShell>
  );
}
