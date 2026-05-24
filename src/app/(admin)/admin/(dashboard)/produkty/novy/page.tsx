import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminCategories } from "@/lib/data/admin";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <AdminPageHeader
        title="Nový produkt"
        description="Po vytvoření produktu můžete na stránce úprav nahrát fotografie."
        breadcrumbs={[
          { label: "Produkty", href: "/admin/produkty" },
          { label: "Nový produkt" },
        ]}
      />
      <ProductForm categories={categories} />
    </>
  );
}
