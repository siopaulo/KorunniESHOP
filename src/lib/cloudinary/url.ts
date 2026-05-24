/**
 * Cloudinary URL transforms — jediná vrstva optimalizace obrázků.
 * Nepoužívejte next/image pro Cloudinary URL (žádná dvojitá komprese).
 */

export type CloudinaryTransform = {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "fit" | "scale";
};

const DEFAULT_TRANSFORMS = ["f_auto", "q_auto", "dpr_auto"] as const;

function buildTransformString(options: CloudinaryTransform): string {
  const parts: string[] = [...DEFAULT_TRANSFORMS];
  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);
  if (options.crop) parts.push(`c_${options.crop}`);
  return parts.join(",");
}

function stripExistingTransforms(rest: string): string {
  let path = rest;
  while (path.length > 0) {
    const slash = path.indexOf("/");
    const segment = slash === -1 ? path : path.slice(0, slash);
    const isVersion = /^v\d+$/.test(segment);
    const isTransform =
      segment.includes(",") ||
      /^(f_|q_|w_|h_|c_|dpr_|g_|e_)/.test(segment);
    if (isVersion || !isTransform) break;
    path = slash === -1 ? "" : path.slice(slash + 1);
  }
  return path;
}

/** Vloží transformace do Cloudinary delivery URL. */
export function cloudinaryImageUrl(src: string, options: CloudinaryTransform = {}): string {
  if (!src.includes("res.cloudinary.com")) return src;

  const marker = "/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const prefix = src.slice(0, idx + marker.length);
  const rest = stripExistingTransforms(src.slice(idx + marker.length));
  const transform = buildTransformString(options);

  return `${prefix}${transform}/${rest}`;
}

/** Responzivní srcset pro produktové karty a galerii. */
export function cloudinarySrcSet(
  src: string,
  widths: number[],
  options: Omit<CloudinaryTransform, "width"> = {},
): string {
  return widths
    .map((w) => `${cloudinaryImageUrl(src, { ...options, width: w })} ${w}w`)
    .join(", ");
}

export const PRODUCT_IMAGE_WIDTHS = [320, 480, 640, 800, 1200] as const;

export const CLOUDINARY_PRESETS = {
  productCard: { width: 640, crop: "fill" as const },
  productDetail: { width: 1200, crop: "limit" as const },
  productThumb: { width: 160, height: 160, crop: "fill" as const },
  adminThumb: { width: 400, crop: "fill" as const },
};
