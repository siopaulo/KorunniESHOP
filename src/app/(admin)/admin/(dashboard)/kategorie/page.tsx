import { getAdminCategories } from "@/lib/data/admin";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Kategorie</h1>
        <p className="text-sm text-muted-foreground">Správa kategorií produktů</p>
      </div>

      <CategoryForm />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Existující kategorie</h2>
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-border bg-card p-4">
            <CategoryForm category={category} />
            <div className="mt-2">
              <DeleteCategoryButton id={category.id} name={category.name} />
            </div>          </div>
        ))}
      </div>
    </div>
  );
}
