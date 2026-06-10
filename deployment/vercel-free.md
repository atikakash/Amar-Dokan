# Vercel Free Deployment Guide

Use two Vercel projects from the same GitHub repository.

## Customer Website

```text
Project root: customer-website
Framework: Next.js
Build command: npm run build
Install command: npm ci
Output: .next
```

Environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
```

## Admin Dashboard

```text
Project root: admin-dashboard
Framework: Next.js
Build command: npm run build
Install command: npm ci
Output: .next
```

Environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
```

## After Both Deploy

Update the Laravel backend `.env`:

```text
CORS_ALLOWED_ORIGINS=https://customer-app.vercel.app,https://admin-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=customer-app.vercel.app,admin-app.vercel.app
FRONTEND_URL=https://customer-app.vercel.app
```

Then clear Laravel config cache:

```bash
cd /var/www/amar-dokan/backend
php artisan optimize:clear
php artisan optimize
```
