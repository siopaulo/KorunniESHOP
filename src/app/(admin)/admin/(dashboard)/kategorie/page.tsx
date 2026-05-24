import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { getAdminCategories } from "@/lib/data/admin";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <AdminPageHeader
        title="Kategorie"
        description={`${categories.length} kategorií v katalogu`}
      />

      <div className="space-y-8">
        <CategoryForm />

        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Existující kategorie</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Zatím žádné kategorie.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-border bg-card p-4">
                <CategoryForm category={category} />
                <div className="mt-2">
                  <DeleteCategoryButton id={category.id} name={category.name} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
