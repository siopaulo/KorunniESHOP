import { getAdminCategories } from "@/lib/data/admin";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { deleteCategoryFormAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

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
            <form action={deleteCategoryFormAction} className="mt-2">
              <input type="hidden" name="id" value={category.id} />
              <Button type="submit" variant="destructive" size="sm">
                Smazat
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
