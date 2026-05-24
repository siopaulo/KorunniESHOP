import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { isCloudinaryConfigured } from "@/lib/cloudinary/config";

function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary není nakonfigurováno — doplňte env proměnné");
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

  return cloudinary;
}

export async function uploadProductImage(
  buffer: Buffer,
  productId: string,
): Promise<{ url: string; publicId: string }> {
  const cld = getCloudinary();

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    cld.uploader
      .upload_stream(
        {
          folder: `korunni-byliny/products/${productId}`,
          resource_type: "image",
          // Transformace jen při zobrazení (cloudinaryImageUrl) — eager transformace
          // způsobují Invalid Signature při server-side uploadu.
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload selhal"));
            return;
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        },
      )
      .end(buffer);
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const cld = getCloudinary();
  await cld.uploader.destroy(publicId);
}
