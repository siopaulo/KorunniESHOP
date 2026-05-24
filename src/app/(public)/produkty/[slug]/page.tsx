import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { createPageMetadata } from "@/components/shared/PageShell";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return createPageMetadata("Produkt nenalezen", "Produkt neexistuje.");

  return createPageMetadata(
    product.name,
    product.short_description || product.seo_description || `${product.name} — ${siteConfig.name}`,
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts({ categorySlug: product.category?.slug }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description,
    image: product.images?.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "CZK",
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Produkty", href: "/produkty" },
          ...(product.category
            ? [{ label: product.category.name, href: `/kategorie/${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <div className="section-padding">
        <div className="container-wide grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images ?? []} productName={product.name} />
          <ProductPurchasePanel product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Související produkty</h2>
            <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
