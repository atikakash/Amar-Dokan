"use client";

import axios from "axios";
import type {
  ApiEnvelope,
  ApiFilters,
  AuthResponse,
  Cart,
  CartItem,
  Category,
  CheckoutPayload,
  CouponValidation,
  Order,
  Paginated,
  Payment,
  PaymentGateway,
  Product,
  User,
  WishlistItem,
} from "@/lib/api/types";

const now = new Date().toISOString();

let currentUser: User = {
  id: 10,
  name: "Customer User",
  email: "customer@example.com",
  phone: "+8801711111111",
  role: "customer",
  email_verified_at: now,
  created_at: now,
};

const categories: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: "Cat Food",
    slug: "cat-food",
    description: "Dry food, wet food, kitten meals, and premium formulas.",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119",
    is_active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    parent_id: null,
    name: "Cat Litter",
    slug: "cat-litter",
    description: "Clumping litter, tofu litter, deodorizer, and trays.",
    image: "https://images.unsplash.com/photo-1570824104453-508955ab713e",
    is_active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    parent_id: null,
    name: "Accessories",
    slug: "accessories",
    description: "Bowls, collars, carriers, toys, grooming, and care items.",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f",
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 4,
    parent_id: null,
    name: "Dog Essentials",
    slug: "dog-essentials",
    description: "Food, treats, grooming, and daily care for dogs.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
    is_active: true,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
  {
    id: 5,
    parent_id: null,
    name: "Health Care",
    slug: "health-care",
    description: "Deworming, supplements, hygiene, and routine wellness.",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4",
    is_active: true,
    sort_order: 5,
    created_at: now,
    updated_at: now,
  },
  {
    id: 6,
    parent_id: null,
    name: "Treats",
    slug: "treats",
    description: "Crunchy bites, creamy treats, and reward snacks.",
    image: "https://images.unsplash.com/photo-1601758064224-c3c94cf1f14f",
    is_active: true,
    sort_order: 6,
    created_at: now,
    updated_at: now,
  },
];

const products: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Reflex Plus Adult Cat Food Salmon 1.5kg",
    slug: "reflex-plus-adult-cat-food-salmon-1-5kg",
    sku: "CAT-REF-SAL-15",
    description: "Complete salmon dry food for adult cats with balanced protein, vitamins, and digestive support.",
    price: "1450.00",
    compare_price: "1650.00",
    stock_quantity: 18,
    low_stock_threshold: 8,
    is_active: true,
    is_featured: true,
    attributes: { weight: "1.5kg", flavour: "Salmon", sold_count: "126", reward_points: "14", delivery_note: "Inside Dhaka 1-2 days" },
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119", alt_text: "Cat food bag", sort_order: 1, is_primary: true },
      { id: 11, url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e", alt_text: "Adult cat eating", sort_order: 2, is_primary: false },
    ],
    reviews: [
      { id: 1, product_id: 1, user_id: 10, rating: 5, title: "Good for picky cats", comment: "Fresh pack and fast delivery in Dhaka.", is_approved: true, created_at: now },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: 2,
    category_id: 2,
    name: "Tofu Cat Litter Green Tea 6L",
    slug: "tofu-cat-litter-green-tea-6l",
    sku: "LIT-TOFU-GT-06",
    description: "Low-dust clumping tofu litter with green tea fragrance and easy disposal.",
    price: "780.00",
    compare_price: "900.00",
    stock_quantity: 4,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    attributes: { size: "6L", scent: "Green Tea", sold_count: "82", reward_points: "8", delivery_note: "Same-day delivery in selected Dhaka areas" },
    images: [
      { id: 2, url: "https://images.unsplash.com/photo-1570824104453-508955ab713e", alt_text: "Cat near litter area", sort_order: 1, is_primary: true },
      { id: 12, url: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee", alt_text: "Cat care supplies", sort_order: 2, is_primary: false },
    ],
    reviews: [
      { id: 2, product_id: 2, user_id: 10, rating: 4, title: "Controls smell well", comment: "Clumps nicely and has less dust than regular litter.", is_approved: true, created_at: now },
    ],
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    category_id: 2,
    name: "Adjustable Cat Harness and Leash Set",
    slug: "adjustable-cat-harness-and-leash-set",
    sku: "ACC-HARNESS-03",
    description: "Soft breathable harness with secure clips and a matching leash for outdoor walks.",
    price: "520.00",
    compare_price: "650.00",
    stock_quantity: 25,
    low_stock_threshold: 6,
    is_active: true,
    is_featured: false,
    attributes: { sizes: "S, M, L", colors: "Red, Blue, Black", sold_count: "64", reward_points: "5", delivery_note: "Exchange available for size issue" },
    images: [
      { id: 3, url: "https://images.unsplash.com/photo-1545249390-6bdfa286032f", alt_text: "Cat accessory", sort_order: 1, is_primary: true },
      { id: 13, url: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec", alt_text: "Cat wearing accessory", sort_order: 2, is_primary: false },
    ],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 4,
    category_id: 6,
    name: "Creamy Cat Treat Tuna Pack",
    slug: "creamy-cat-treat-tuna-pack",
    sku: "TRT-CREAM-TUNA-04",
    description: "Smooth tuna treat sticks for training, bonding, and picky snack moments.",
    price: "260.00",
    compare_price: null,
    stock_quantity: 12,
    low_stock_threshold: 4,
    is_active: true,
    is_featured: true,
    attributes: { flavour: "Tuna", pack: "5 sticks", sold_count: "213", reward_points: "3", delivery_note: "Best paired with dry meals" },
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1601758064224-c3c94cf1f14f", alt_text: "Pet treats", sort_order: 1, is_primary: true },
      { id: 14, url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5", alt_text: "Cat treat moment", sort_order: 2, is_primary: false },
    ],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 5,
    category_id: 4,
    name: "Drools Puppy Chicken and Egg 3kg",
    slug: "drools-puppy-chicken-and-egg-3kg",
    sku: "DOG-DROOLS-PUP-05",
    description: "High-protein puppy food with chicken, egg, calcium, and growth support nutrients.",
    price: "2350.00",
    compare_price: "2600.00",
    stock_quantity: 9,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    attributes: { weight: "3kg", flavour: "Chicken and Egg", sold_count: "45", reward_points: "24", delivery_note: "Heavy item delivery charge may vary" },
    images: [
      { id: 5, url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee", alt_text: "Dog essentials", sort_order: 1, is_primary: true },
      { id: 15, url: "https://images.unsplash.com/photo-1558788353-f76d92427f16", alt_text: "Dog with food", sort_order: 2, is_primary: false },
    ],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: 6,
    category_id: 5,
    name: "Cat Deworming Tablet 10mg",
    slug: "cat-deworming-tablet-10mg",
    sku: "HLT-DEWORM-06",
    description: "Routine deworming support for cats. Use based on weight and vet guidance.",
    price: "120.00",
    compare_price: null,
    stock_quantity: 31,
    low_stock_threshold: 10,
    is_active: true,
    is_featured: false,
    attributes: { dose: "10mg", pet_type: "Cat", sold_count: "97", reward_points: "1", delivery_note: "Consult a vet for correct dosage" },
    images: [
      { id: 6, url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4", alt_text: "Pet health care", sort_order: 1, is_primary: true },
      { id: 16, url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97", alt_text: "Cat health care", sort_order: 2, is_primary: false },
    ],
    reviews: [],
    created_at: now,
    updated_at: now,
  },
];

let cart: Cart = {
  id: 1,
  status: "active",
  items: [makeCartItem(1, 1, 1), makeCartItem(2, 2, 1)],
  subtotal: 2230,
  created_at: now,
  updated_at: now,
};

let wishlist: WishlistItem[] = [
  { id: 1, product_id: 3, product: withCategory(products[2]), created_at: now },
  { id: 2, product_id: 4, product: withCategory(products[3]), created_at: now },
];

let orders: Order[] = [
  {
    id: 1,
    order_number: "ORD-10001",
    status: "processing",
    payment_status: "paid",
    subtotal: "2230.00",
    discount_total: "223.00",
    tax_total: "0.00",
    shipping_total: "80.00",
    total: "2087.00",
    coupon_code: "WELCOME10",
    customer_note: null,
    shipping_address: { city: "Dhaka", address_line_1: "Banani" },
    billing_address: null,
    user: currentUser,
    items: [
      { id: 1, product_id: 1, product_name: "Reflex Plus Adult Cat Food Salmon 1.5kg", product_sku: "CAT-REF-SAL-15", quantity: 1, unit_price: "1450.00", total: "1450.00" },
      { id: 2, product_id: 2, product_name: "Tofu Cat Litter Green Tea 6L", product_sku: "LIT-TOFU-GT-06", quantity: 1, unit_price: "780.00", total: "780.00" },
    ],
    created_at: now,
    updated_at: now,
  },
];

function isLocalPreview() {
  if (typeof window === "undefined") return false;

  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

export function canUseDemoFallback(error: unknown) {
  return isLocalPreview() && axios.isAxiosError(error) && !error.response;
}

function page<T>(data: T[]): Paginated<T> {
  return {
    data,
    meta: {
      current_page: 1,
      from: data.length ? 1 : null,
      last_page: 1,
      per_page: data.length,
      to: data.length || null,
      total: data.length,
    },
  };
}

function withCategory(product: Product): Product {
  return { ...product, category: categories.find((category) => category.id === product.category_id) };
}

function makeCartItem(id: number, productId: number, quantity: number): CartItem {
  const product = products.find((item) => item.id === productId)!;
  const unitPrice = Number(product.price);

  return {
    id,
    product_id: productId,
    quantity,
    unit_price: unitPrice.toFixed(2),
    line_total: (unitPrice * quantity).toFixed(2),
    product: withCategory(product),
  };
}

function refreshCart() {
  cart = {
    ...cart,
    subtotal: cart.items.reduce((sum, item) => sum + Number(item.line_total), 0),
    updated_at: new Date().toISOString(),
  };

  return cart;
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export const demoApi = {
  register(payload: { name: string; email: string; phone?: string }): AuthResponse {
    currentUser = {
      ...currentUser,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      email_verified_at: now,
    };

    return { token_type: "Bearer", access_token: "demo-customer-token", user: currentUser };
  },
  login(payload: { email: string; password: string }): AuthResponse {
    if (payload.email !== "customer@example.com" || payload.password !== "password") {
      throw new Error("Use customer@example.com and password for local preview.");
    }

    return { token_type: "Bearer", access_token: "demo-customer-token", user: currentUser };
  },
  profile(): User {
    return currentUser;
  },
  updateProfile(payload: Partial<Pick<User, "name" | "email" | "phone">>): User {
    currentUser = { ...currentUser, ...payload };
    return currentUser;
  },
  categories(filters?: ApiFilters): Paginated<Category> {
    let rows = [...categories];

    if (filters?.is_active !== undefined) {
      rows = rows.filter((category) => category.is_active === Boolean(filters.is_active));
    }

    if (filters?.search) {
      const search = String(filters.search).toLowerCase();
      rows = rows.filter((category) => category.name.toLowerCase().includes(search));
    }

    rows = rows.slice(0, Number(filters?.per_page ?? rows.length));

    return page(rows);
  },
  products(filters?: ApiFilters): Paginated<Product> {
    let rows = products.map(withCategory);

    if (filters?.is_active !== undefined) {
      rows = rows.filter((product) => product.is_active === Boolean(filters.is_active));
    }

    if (filters?.is_featured !== undefined) {
      rows = rows.filter((product) => product.is_featured === Boolean(filters.is_featured));
    }

    if (filters?.category_id) {
      rows = rows.filter((product) => product.category_id === Number(filters.category_id));
    }

    if (filters?.search) {
      const search = String(filters.search).toLowerCase();
      rows = rows.filter((product) =>
        [product.name, product.sku, product.description, product.category?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search)),
      );
    }

    rows = rows.slice(0, Number(filters?.per_page ?? rows.length));

    return page(rows);
  },
  product(id: number | string): Product {
    return withCategory(products.find((product) => product.id === Number(id) || product.slug === id) ?? products[0]);
  },
  productReviews(): ApiEnvelope<[]> {
    return { data: [] };
  },
  cart: {
    show(): Cart {
      return refreshCart();
    },
    add(productId: number, quantity: number): Cart {
      const existing = cart.items.find((item) => item.product_id === productId);
      const product = products.find((item) => item.id === productId);
      const stockQuantity = product?.stock_quantity ?? quantity;

      if (existing) {
        existing.quantity = Math.min(stockQuantity, existing.quantity + quantity);
        existing.line_total = (Number(existing.unit_price) * existing.quantity).toFixed(2);
      } else if (stockQuantity > 0) {
        cart.items = [...cart.items, makeCartItem(nextId(cart.items), productId, Math.min(stockQuantity, quantity))];
      }

      return refreshCart();
    },
    update(itemId: number, quantity: number): Cart {
      cart.items = cart.items.map((item) => {
        if (item.id !== itemId) return item;

        const product = products.find((productItem) => productItem.id === item.product_id);
        const nextQuantity = Math.min(product?.stock_quantity ?? quantity, Math.max(1, quantity));

        return { ...item, quantity: nextQuantity, line_total: (Number(item.unit_price) * nextQuantity).toFixed(2) };
      });

      return refreshCart();
    },
    remove(itemId: number): Cart {
      cart.items = cart.items.filter((item) => item.id !== itemId);
      return refreshCart();
    },
    clear() {
      cart.items = [];
      refreshCart();
    },
  },
  wishlist: {
    list(): WishlistItem[] {
      return wishlist;
    },
    add(productId: number) {
      if (wishlist.some((item) => item.product_id === productId)) return;

      const product = products.find((item) => item.id === productId);
      if (product) wishlist = [{ id: nextId(wishlist), product_id: productId, product: withCategory(product), created_at: now }, ...wishlist];
    },
    remove(productId: number) {
      wishlist = wishlist.filter((item) => item.product_id !== productId);
    },
  },
  orders: {
    list(): Paginated<Order> {
      return page(orders);
    },
    create(payload: CheckoutPayload): Order {
      const subtotal = Number(refreshCart().subtotal);
      const discount = payload.coupon_code ? Math.min(10, subtotal * 0.1) : 0;
      const order: Order = {
        id: nextId(orders),
        order_number: `ORD-${10000 + nextId(orders)}`,
        status: "pending",
        payment_status: "unpaid",
        subtotal: subtotal.toFixed(2),
        discount_total: discount.toFixed(2),
        tax_total: String(payload.tax_total ?? 0),
        shipping_total: String(payload.shipping_total ?? 0),
        total: Math.max(0, subtotal - discount + Number(payload.shipping_total ?? 0) + Number(payload.tax_total ?? 0)).toFixed(2),
        coupon_code: payload.coupon_code ?? null,
        customer_note: payload.customer_note ?? null,
        shipping_address: payload.shipping_address,
        billing_address: payload.billing_address ?? null,
        user: currentUser,
        items: cart.items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product?.name ?? "Product",
          product_sku: item.product?.sku ?? "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.line_total,
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      orders = [order, ...orders];
      demoApi.cart.clear();
      return order;
    },
  },
  payments: {
    initiate(orderId: number, gateway: PaymentGateway): Payment {
      const order = orders.find((item) => item.id === orderId);

      return {
        id: orderId,
        order_id: orderId,
        gateway,
        status: "initiated",
        transaction_id: `DEMO-${Date.now()}`,
        gateway_payment_id: null,
        gateway_reference: null,
        amount: order?.total ?? "0.00",
        currency: "BDT",
        checkout_url: null,
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order,
      };
    },
  },
  coupons: {
    validate(code: string, subtotal: number): CouponValidation {
      if (code.toUpperCase() !== "WELCOME10") {
        throw new Error("Try WELCOME10 for the local preview.");
      }

      return {
        coupon: { id: 1, code: "WELCOME10", type: "percent", value: "10" },
        discount: Math.min(10, subtotal * 0.1),
      };
    },
  },
};
