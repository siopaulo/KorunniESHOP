export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export type InvoiceStatus = "draft" | "issued" | "sent" | "paid" | "cancelled";

type Table<
  Row,
  Insert = Partial<Row>,
  Update = Partial<Insert>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      product_categories: Table<{
        id: string;
        name: string;
        slug: string;
        description: string;
        image_url: string | null;
        seo_title: string | null;
        seo_description: string | null;
        sort_order: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }, {
        id?: string;
        name: string;
        slug: string;
        description?: string;
        image_url?: string | null;
        seo_title?: string | null;
        seo_description?: string | null;
        sort_order?: number;
        is_active?: boolean;
        created_at?: string;
        updated_at?: string;
      }>;
      products: Table<{
        id: string;
        category_id: string;
        name: string;
        slug: string;
        description: string;
        short_description: string;
        price: number;
        compare_at_price: number | null;
        stock_quantity: number;
        low_stock_threshold: number;
        sku: string | null;
        is_active: boolean;
        is_featured: boolean;
        tags: string[];
        seo_title: string | null;
        seo_description: string | null;
        weight_grams: number | null;
        created_at: string;
        updated_at: string;
      }, {
        id?: string;
        category_id: string;
        name: string;
        slug: string;
        description?: string;
        short_description?: string;
        price: number;
        compare_at_price?: number | null;
        stock_quantity?: number;
        low_stock_threshold?: number;
        sku?: string | null;
        is_active?: boolean;
        is_featured?: boolean;
        tags?: string[];
        seo_title?: string | null;
        seo_description?: string | null;
        weight_grams?: number | null;
        created_at?: string;
        updated_at?: string;
      }>;
      product_images: Table<{
        id: string;
        product_id: string;
        url: string;
        public_id: string | null;
        alt_text: string;
        sort_order: number;
        is_primary: boolean;
        created_at: string;
      }, {
        id?: string;
        product_id: string;
        url: string;
        public_id?: string | null;
        alt_text?: string;
        sort_order?: number;
        is_primary?: boolean;
        created_at?: string;
      }>;
      customers: Table<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string | null;
        created_at: string;
      }, {
        id?: string;
        email: string;
        first_name?: string;
        last_name?: string;
        phone?: string | null;
        created_at?: string;
      }>;
      orders: Table<{
        id: string;
        order_number: string;
        customer_id: string | null;
        status: OrderStatus;
        subtotal: number;
        shipping_cost: number;
        discount: number;
        total: number;
        currency: string;
        shipping_address: Json;
        billing_address: Json;
        customer_note: string | null;
        admin_note: string | null;
        stripe_payment_intent_id: string | null;
        payment_status: string;
        invoice_status: string;
        gdpr_consent: boolean;
        terms_consent: boolean;
        created_at: string;
        updated_at: string;
      }, {
        id?: string;
        order_number?: string;
        customer_id?: string | null;
        status?: OrderStatus;
        subtotal?: number;
        shipping_cost?: number;
        discount?: number;
        total?: number;
        currency?: string;
        shipping_address?: Json;
        billing_address?: Json;
        customer_note?: string | null;
        admin_note?: string | null;
        stripe_payment_intent_id?: string | null;
        payment_status?: string;
        invoice_status?: string;
        gdpr_consent?: boolean;
        terms_consent?: boolean;
        created_at?: string;
        updated_at?: string;
      }>;
      order_items: Table<{
        id: string;
        order_id: string;
        product_id: string | null;
        variant_id: string | null;
        product_name: string;
        product_sku: string | null;
        quantity: number;
        unit_price: number;
        total_price: number;
        created_at: string;
      }, {
        id?: string;
        order_id: string;
        product_id?: string | null;
        variant_id?: string | null;
        product_name: string;
        product_sku?: string | null;
        quantity: number;
        unit_price: number;
        total_price: number;
        created_at?: string;
      }>;
      payments: Table<{
        id: string;
        order_id: string;
        provider: string;
        provider_payment_id: string | null;
        amount: number;
        currency: string;
        status: string;
        metadata: Json;
        created_at: string;
      }, {
        id?: string;
        order_id: string;
        provider?: string;
        provider_payment_id?: string | null;
        amount: number;
        currency?: string;
        status?: string;
        metadata?: Json;
        created_at?: string;
      }>;
      invoices: Table<{
        id: string;
        order_id: string;
        provider: string;
        provider_invoice_id: string | null;
        invoice_number: string | null;
        status: InvoiceStatus;
        pdf_url: string | null;
        issued_at: string | null;
        created_at: string;
        updated_at: string;
      }, {
        id?: string;
        order_id: string;
        provider?: string;
        provider_invoice_id?: string | null;
        invoice_number?: string | null;
        status?: InvoiceStatus;
        pdf_url?: string | null;
        issued_at?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      admin_profiles: Table<{
        id: string;
        email: string;
        full_name: string;
        role: AdminRole;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }, {
        id: string;
        email: string;
        full_name?: string;
        role?: AdminRole;
        is_active?: boolean;
        created_at?: string;
        updated_at?: string;
      }>;
      audit_logs: Table<{
        id: string;
        user_id: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        metadata: Json;
        ip_address: string | null;
        created_at: string;
      }, {
        id?: string;
        user_id?: string | null;
        action: string;
        entity_type: string;
        entity_id?: string | null;
        metadata?: Json;
        ip_address?: string | null;
        created_at?: string;
      }>;
      site_settings: Table<{
        id: string;
        shop_name: string;
        shop_email: string;
        phone: string;
        address: string;
        ico: string | null;
        dic: string | null;
        bank_account: string | null;
        social_links: Json;
        shipping_config: Json;
        payment_methods: Json;
        homepage_content: Json;
        footer_content: Json;
        cookie_settings: Json;
        analytics_config: Json;
        created_at: string;
        updated_at: string;
      }>;
      legal_pages: Table<{
        id: string;
        slug: string;
        title: string;
        content: string;
        updated_at: string;
      }, {
        id?: string;
        slug: string;
        title: string;
        content?: string;
        updated_at?: string;
      }>;
      blog_posts: Table<{
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        cover_image_url: string | null;
        status: BlogStatus;
        seo_title: string | null;
        seo_description: string | null;
        published_at: string | null;
        author_id: string | null;
        created_at: string;
        updated_at: string;
      }, {
        title: string;
        slug: string;
        id?: string;
        excerpt?: string;
        content?: string;
        cover_image_url?: string | null;
        status?: BlogStatus;
        seo_title?: string | null;
        seo_description?: string | null;
        published_at?: string | null;
        author_id?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      testimonials: Table<{
        id: string;
        author_name: string;
        content: string;
        rating: number;
        is_active: boolean;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }, {
        id?: string;
        author_name: string;
        content: string;
        rating: number;
        is_active?: boolean;
        sort_order?: number;
        created_at?: string;
        updated_at?: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      order_status: OrderStatus;
      admin_role: AdminRole;
      blog_status: BlogStatus;
      invoice_status: InvoiceStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type ProductRow = Tables<"products">;
export type CategoryRow = Tables<"product_categories">;
export type AdminProfileRow = Tables<"admin_profiles">;
export type OrderRow = Tables<"orders">;
export type CustomerRow = Tables<"customers">;
export type OrderItemRow = Tables<"order_items">;
