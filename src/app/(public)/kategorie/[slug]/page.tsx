import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/data/products";
import { createPageMetadata } from "@/components/shared/PageShell";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return createPageMetadata("Kategorie nenalezena", "Kategorie neexistuje.");

  return createPageMetadata(
    category.name,
    category.seo_description || category.description || `Produkty v kategorii ${category.name}`,
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug });

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Kategorie", href: "/kategorie" },
          { label: category.name },
        ]}
      />
      <div className="section-padding">
        <div className="container-wide">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4 sm:text-lg">
              {category.description}
            </p>
          )}

          {products.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              V této kategorii zatím nejsou žádné produkty.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
