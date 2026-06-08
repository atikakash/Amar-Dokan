# Production Environment Setup

## Required Server Packages

- Docker Engine
- Docker Compose plugin
- Git
- UFW or another firewall
- Optional: Certbot if TLS is terminated directly on the VPS

## Environment Files

Create the production env file:

```bash
cp .env.production.example .env.production
```

Set all secrets before booting the stack:

- `APP_KEY`
- `DB_PASSWORD`
- `DB_ROOT_PASSWORD`
- `GRAFANA_ADMIN_PASSWORD`
- SMTP credentials
- SSLCommerz credentials
- bKash credentials
- Stripe secret and webhook secret

Generate `APP_KEY` locally or on the server:

```bash
docker run --rm -it -v "$PWD/backend:/app" -w /app php:8.3-cli php artisan key:generate --show
```

Use the printed key as `APP_KEY`.

## URLs

Recommended production URLs:

```text
https://example.com              Customer website
https://example.com/admin        Admin dashboard
https://example.com/api/v1       Laravel API
https://example.com/up           Laravel health endpoint
```

Set:

```text
APP_URL=https://example.com
PUBLIC_API_URL=https://example.com/api/v1
FRONTEND_URL=https://example.com
CORS_ALLOWED_ORIGINS=https://example.com
SANCTUM_STATEFUL_DOMAINS=example.com
```

If you use separate domains, update Nginx and CORS accordingly.

## Payment Webhooks

Configure providers to call:

```text
Stripe:      https://example.com/api/v1/payments/webhooks/stripe
SSLCommerz:  https://example.com/api/v1/payments/webhooks/sslcommerz/ipn
bKash:       https://example.com/api/v1/payments/bkash/callback
```

Stripe requires `STRIPE_WEBHOOK_SECRET`.

## First Boot

```bash
docker compose --env-file .env.production build
docker compose --env-file .env.production up -d
docker compose --env-file .env.production exec backend php artisan migrate --force
docker compose --env-file .env.production exec backend php artisan storage:link
docker compose --env-file .env.production exec backend php artisan optimize
```

## Operational Commands

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f nginx
docker compose --env-file .env.production logs -f backend
docker compose --env-file .env.production exec backend php artisan queue:failed
```
