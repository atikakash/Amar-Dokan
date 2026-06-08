# Ecommerce API Documentation

Base URL: `/api/v1`

Authentication: Sanctum bearer token. Send `Authorization: Bearer <token>` for protected routes.

## Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a customer |
| POST | `/auth/login` | Public | Login and receive token |
| POST | `/auth/logout` | Bearer | Revoke current token |
| POST | `/auth/forgot-password` | Public | Send password reset link |
| POST | `/auth/reset-password` | Public | Reset password |
| GET | `/auth/profile` | Bearer | Current user profile |
| PUT | `/auth/profile` | Bearer | Update profile |
| GET | `/auth/email/verify/{id}/{hash}` | Bearer + signed | Verify email |
| POST | `/auth/email/verification-notification` | Bearer | Resend verification |

## Catalog

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/categories` | Public | List categories |
| GET | `/categories/{category}` | Public | Show category |
| POST | `/categories` | Admin/Manager | Create category |
| PUT | `/categories/{category}` | Admin/Manager | Update category |
| DELETE | `/categories/{category}` | Admin/Manager | Delete category |
| GET | `/products` | Public | List products |
| GET | `/products/{product}` | Public | Show product |
| POST | `/products` | Admin/Manager | Create product |
| PUT | `/products/{product}` | Admin/Manager | Update product |
| DELETE | `/products/{product}` | Admin/Manager | Delete product |

## Commerce

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/cart` | Verified user | Show active cart |
| POST | `/cart/items` | Verified user | Add product to cart |
| PUT | `/cart/items/{item}` | Verified user | Update cart item quantity |
| DELETE | `/cart/items/{item}` | Verified user | Remove cart item |
| DELETE | `/cart` | Verified user | Clear cart |
| GET | `/wishlist` | Verified user | List wishlist |
| POST | `/wishlist` | Verified user | Add wishlist product |
| DELETE | `/wishlist/{product}` | Verified user | Remove wishlist product |
| GET | `/orders` | Verified user | List own orders; staff see all |
| POST | `/orders` | Verified user | Create order from cart |
| GET | `/orders/{order}` | Verified user | Show order |
| PATCH | `/orders/{order}/status` | Admin/Manager | Update order status |

## Reviews and Coupons

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/products/{product}/reviews` | Public | Approved product reviews |
| POST | `/reviews` | Verified user | Create review |
| PUT | `/reviews/{review}` | Review owner or staff | Update review |
| DELETE | `/reviews/{review}` | Review owner or staff | Delete review |
| POST | `/coupons/validate` | Public | Validate coupon amount |
| GET | `/coupons` | Admin/Manager | List coupons |
| POST | `/coupons` | Admin/Manager | Create coupon |
| GET | `/coupons/{coupon}` | Admin/Manager | Show coupon |
| PUT | `/coupons/{coupon}` | Admin/Manager | Update coupon |
| DELETE | `/coupons/{coupon}` | Admin/Manager | Delete coupon |

## Payments

Payment initiation is protected by Sanctum and requires a verified customer account. Gateway callbacks/webhooks are public because they are called by the payment providers.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/payments/initiate` | Verified user | Create a gateway payment session for an unpaid order |
| GET | `/payments/{payment}` | Verified user | Show payment status |
| POST | `/payments/webhooks/stripe` | Stripe signature | Stripe Checkout webhook |
| POST | `/payments/webhooks/sslcommerz/ipn` | Provider IPN | SSLCommerz IPN |
| GET/POST | `/payments/sslcommerz/success` | Provider redirect | SSLCommerz success redirect |
| GET/POST | `/payments/sslcommerz/fail` | Provider redirect | SSLCommerz failed redirect |
| GET/POST | `/payments/sslcommerz/cancel` | Provider redirect | SSLCommerz cancel redirect |
| GET/POST | `/payments/bkash/callback` | Provider redirect | bKash callback and execute payment |

### Initiate Payment

```json
{
  "order_id": 1,
  "gateway": "stripe",
  "currency": "USD",
  "success_url": "http://localhost:3001/orders",
  "cancel_url": "http://localhost:3001/checkout"
}
```

Supported gateways:

- `stripe`
- `sslcommerz`
- `bkash`

Payment statuses:

- `initiated`
- `pending`
- `succeeded`
- `failed`
- `cancelled`
- `refunded`

Order `payment_status` is updated to `paid`, `failed`, `refunded`, or `unpaid` from payment webhook results.

## Error Format

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Default Seed Credentials

All seeded users use password `password`.

| Role | Email |
| --- | --- |
| Admin | `admin@example.com` |
| Manager | `manager@example.com` |
| Customer | `customer@example.com` |
