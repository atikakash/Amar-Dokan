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

export type Review = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  user?: User;
  created_at: string;
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
  reviews?: Review[];
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  line_total: string;
  product?: Product;
};

export type Cart = {
  id: number;
  status: string;
  items: CartItem[];
  subtotal: number | string;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";
export type PaymentGateway = "sslcommerz" | "bkash" | "stripe";
export type GatewayPaymentStatus = "initiated" | "pending" | "succeeded" | "failed" | "cancelled" | "refunded";

export type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  total: string;
};

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

export type Payment = {
  id: number;
  order_id: number;
  gateway: PaymentGateway;
  status: GatewayPaymentStatus;
  transaction_id: string;
  gateway_payment_id: string | null;
  gateway_reference: string | null;
  amount: string;
  currency: string;
  checkout_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
};

export type WishlistItem = {
  id: number;
  product_id: number;
  product?: Product;
  created_at: string;
};

export type CouponValidation = {
  coupon: {
    id: number;
    code: string;
    type: "fixed" | "percent";
    value: string;
  };
  discount: number;
};

export type Paginated<T> = {
  data: T[];
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type ApiEnvelope<T> = {
  data: T;
};

export type AuthResponse = {
  token_type: "Bearer";
  access_token: string;
  user: User;
};

export type ApiFilters = Record<string, string | number | boolean | undefined | null>;

export type CheckoutPayload = {
  coupon_code?: string;
  customer_note?: string;
  shipping_total?: number;
  tax_total?: number;
  shipping_address: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
  };
  billing_address?: CheckoutPayload["shipping_address"];
};
