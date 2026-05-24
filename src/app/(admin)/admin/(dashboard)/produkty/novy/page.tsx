import { getAdminCategories } from "@/lib/data/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Nový produkt</h1>
      <p className="text-sm text-muted-foreground">
        Po vytvoření produktu můžete na stránce úprav nahrát fotografie.
      </p>
      <ProductForm categories={categories} />
    </div>
  );
}
