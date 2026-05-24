import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { getSiteSettings } from "@/lib/data/content";

export const metadata = createPageMetadata(
  "Pokladna",
  "Dokončete svou objednávku bezpečně a rychle.",
);

export default async function CheckoutPage() {
  const settings = await getSiteSettings();
  const shipping = (settings?.shipping_config ?? {}) as {
    flatRate?: number;
    freeShippingThreshold?: number;
  };

  return (
    <PageShell title="Pokladna" description="Vyplňte dodací údaje a dokončete objednávku.">
      <CheckoutForm
        flatRate={shipping.flatRate ?? 99}
        freeShippingThreshold={shipping.freeShippingThreshold ?? 1500}
      />
    </PageShell>
  );
}
