import { getProducts } from "@/lib/data/products";
import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata = createPageMetadata(
  "Produkty",
  "Prohlédněte si naši nabídku bylinných mýdel, šamponů, mastí a elixírů.",
);

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <PageShell
      title="Všechny produkty"
      description="Ručně vyráběné bylinné produkty z Korunní."
    >
      {products.length === 0 ? (
        <p className="text-muted-foreground">Momentálně nemáme žádné produkty v nabídce.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
