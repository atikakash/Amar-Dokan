# Render + Supabase PostgreSQL + Vercel Deployment

Use this when deploying the Laravel API to Render, PostgreSQL to Supabase, and both Next.js apps to Vercel.

## 1. Render Backend Service

Create a Render **Web Service** from the GitHub repo.

Use these settings:

```text
Name: Amar-Dokan
Language: Docker
Branch: main
Root Directory: leave empty
Dockerfile Path: backend/Dockerfile.render
Plan: Free or Starter
```

Do not use `backend/Dockerfile` for Render. That file runs PHP-FPM for the Docker Compose stack. Render needs a container that listens on `$PORT`, so use `backend/Dockerfile.render`.

## 2. Supabase PostgreSQL

Create a Supabase project and copy the database connection values.

In Render environment variables, use:

```text
DB_CONNECTION=pgsql
DB_HOST=<supabase-db-host>
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=<supabase-db-password>
DB_SSLMODE=require
```

Use the direct database host from Supabase when possible. If Supabase gives you a pooler host, use the pooler values they provide.

## 3. Required Render Environment Variables

Generate the Laravel app key locally:

```bash
cd backend
php artisan key:generate --show
```

Add these in Render:

```text
APP_NAME=Amar Dokan API
APP_ENV=production
APP_KEY=<generated app key>
APP_DEBUG=false
APP_URL=https://your-render-service.onrender.com
APP_TIMEZONE=Asia/Dhaka

LOG_CHANNEL=stack
LOG_LEVEL=error

CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database

CORS_ALLOWED_ORIGINS=https://your-customer-app.vercel.app,https://your-admin-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-customer-app.vercel.app,your-admin-app.vercel.app
FRONTEND_URL=https://your-customer-app.vercel.app

PAYMENT_DEFAULT_CURRENCY=BDT
PAYMENT_SUCCESS_URL=https://your-customer-app.vercel.app/orders
PAYMENT_CANCEL_URL=https://your-customer-app.vercel.app/checkout
```

Payment provider variables can stay blank until you configure payment gateways.

## 4. Render Health Check

After deploy:

```text
https://your-render-service.onrender.com/api/v1/health
```

Expected:

```json
{"status":"ok"}
```

## 5. Vercel Customer Website

Create a Vercel project from the same GitHub repo.

```text
Root Directory: customer-website
Framework: Next.js
Environment Variable:
NEXT_PUBLIC_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

## 6. Vercel Admin Dashboard

Create another Vercel project from the same GitHub repo.

```text
Root Directory: admin-dashboard
Framework: Next.js
Environment Variable:
NEXT_PUBLIC_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

## 7. After Vercel Deploys

Copy both Vercel URLs and update Render:

```text
CORS_ALLOWED_ORIGINS=https://your-customer-app.vercel.app,https://your-admin-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-customer-app.vercel.app,your-admin-app.vercel.app
FRONTEND_URL=https://your-customer-app.vercel.app
```

Redeploy the Render service after changing environment variables.
