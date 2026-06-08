export type Role = "admin" | "manager" | "customer";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  email_verified_at: string | null;
  created_at: string;
};

export type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  parent?: Category | null;
  children?: Category[];
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: number;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: string;
  compare_price: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  attributes: Record<string, string> | null;
  category?: Category;
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  total: string;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export type Order = {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  shipping_total: string;
  total: string;
  coupon_code: string | null;
  customer_note: string | null;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string> | null;
  user?: User;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type Coupon = {
  id: number;
  code: string;
  type: "fixed" | "percent";
  value: string;
  min_order_amount: string;
  max_discount_amount: string | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  data: T[];
  links?: unknown;
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type AuthResponse = {
  token_type: "Bearer";
  access_token: string;
  user: User;
};

export type ApiEnvelope<T> = {
  data: T;
};

export type ApiFilters = Record<string, string | number | boolean | undefined | null>;
