# Ecommerce Laravel API

Phase 1 backend for the production eCommerce platform.

## Requirements

- PHP 8.2+
- Composer
- MySQL 8+

## Install

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API base URL:

```text
http://localhost:8000/api/v1
```

## Test

```bash
php artisan test
```

## Queue Worker

```bash
php artisan queue:work
```

API route reference is in `docs/api.md`.
