import { z } from "zod";

export const orderStatusSchema = z.enum([
  "new",
  "awaiting_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "returned",
]);

export const adminRoleSchema = z.enum(["admin", "editor", "orders_only"]);

export const blogStatusSchema = z.enum(["draft", "published"]);

export const productTagSchema = z.enum(["novinka", "bestseller", "sleva"]);

export const addressSchema = z.object({
  firstName: z.string().min(1, "Jméno je povinné"),
  lastName: z.string().min(1, "Příjmení je povinné"),
  street: z.string().min(1, "Ulice je povinná"),
  city: z.string().min(1, "Město je povinné"),
  zip: z.string().regex(/^\d{3}\s?\d{2}$/, "Neplatné PSČ"),
  country: z.string().default("CZ"),
  phone: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Název je povinný").max(120),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Neplatný slug"),
  description: z.string().max(2000).default(""),
  imageUrl: z.string().url().optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  categoryId: z.string().uuid("Neplatná kategorie"),
  name: z.string().min(1, "Název je povinný").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Neplatný slug"),
  description: z.string().max(10000).default(""),
  shortDescription: z.string().max(500).default(""),
  price: z.number().min(0, "Cena musí být kladná"),
  compareAtPrice: z.number().min(0).optional().nullable(),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  sku: z.string().max(50).optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  weightGrams: z.number().int().positive().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Neplatný e-mail"),
  password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
});

export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).default(""),
  content: z.string().max(50000).default(""),
  coverImageUrl: z.string().url().optional().nullable(),
  status: blogStatusSchema.default("draft"),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const testimonialSchema = z.object({
  authorName: z.string().min(1).max(100),
  content: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const orderUpdateSchema = z.object({
  status: orderStatusSchema,
  adminNote: z.string().max(2000).optional(),
});

export const siteSettingsSchema = z.object({
  shopName: z.string().min(1).max(120),
  shopEmail: z.string().email(),
  phone: z.string().max(30),
  address: z.string().max(300),
  ico: z.string().max(20).optional().nullable(),
  dic: z.string().max(20).optional().nullable(),
  bankAccount: z.string().max(50).optional().nullable(),
});

export const legalPageSchema = z.object({
  slug: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  content: z.string().max(100000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
