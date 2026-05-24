import { cn } from "@/lib/utils";
import {
  cloudinaryImageUrl,
  cloudinarySrcSet,
  PRODUCT_IMAGE_WIDTHS,
  type CloudinaryTransform,
} from "@/lib/cloudinary/url";

interface CloudinaryImageProps extends CloudinaryTransform {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Vyplňte pro responzivní načítání (např. "(max-width: 768px) 100vw, 50vw") */
  sizes?: string;
  fill?: boolean;
}

/**
 * Obrázek optimalizovaný výhradně přes Cloudinary CDN (f_auto, q_auto, dpr_auto).
 * Nepoužívá next/image — žádná dvojitá optimalizace.
 */
export function CloudinaryImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
  fill = false,
  width,
  height,
  crop = fill ? "fill" : "limit",
}: CloudinaryImageProps) {
  if (!src) return null;

  const defaultWidth = width ?? (fill ? 800 : 640);
  const srcSet = cloudinarySrcSet(src, [...PRODUCT_IMAGE_WIDTHS], { height, crop });
  const mainSrc = cloudinaryImageUrl(src, { width: defaultWidth, height, crop });

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mainSrc}
        srcSet={srcSet}
        sizes={sizes ?? "100vw"}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mainSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-auto max-w-full", className)}
    />
  );
}
