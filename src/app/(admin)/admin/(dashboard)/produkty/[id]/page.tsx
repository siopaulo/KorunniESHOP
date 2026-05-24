import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImagesForm } from "@/components/admin/ProductImagesForm";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { getAdminCategories, getAdminProduct } from "@/lib/data/admin";
import { getProductImages } from "@/lib/data/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories, images] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
    getProductImages(id),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Úprava produktu a fotografií"
        breadcrumbs={[
          { label: "Produkty", href: "/admin/produkty" },
          { label: product.name },
        ]}
        actions={<DeleteProductButton id={product.id} name={product.name} />}
      />
      <div className="space-y-6">
        <ProductForm product={product} categories={categories} />
        <ProductImagesForm
          productId={product.id}
          productName={product.name}
          images={images}
          cloudinaryConfigured={isCloudinaryConfigured()}
        />
      </div>
    </>
  );
}
