import { notFound } from "next/navigation";

import { getAdminProduct, getAdminCategories } from "@/lib/data/admin";
import { getProductImages } from "@/lib/data/products";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { DeleteProductButton, ProductForm } from "@/components/admin/ProductForm";
import { ProductImagesForm } from "@/components/admin/ProductImagesForm";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Upravit produkt</h1>
        <DeleteProductButton id={product.id} />
      </div>
      <ProductForm product={product} categories={categories} />
      <ProductImagesForm
        productId={product.id}
        productName={product.name}
        images={images}
        cloudinaryConfigured={isCloudinaryConfigured()}
      />
    </div>
  );
}
