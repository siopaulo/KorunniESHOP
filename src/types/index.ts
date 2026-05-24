export type OrderStatus =
  | "new"
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "returned";

export type AdminRole = "admin" | "editor" | "orders_only";

export type BlogStatus = "draft" | "published";

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  categorySlug: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface SiteSettings {
  shopName: string;
  shopEmail: string;
  phone: string;
  address: string;
}
