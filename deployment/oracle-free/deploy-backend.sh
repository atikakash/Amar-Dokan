#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/amar-dokan}"
BRANCH="${BRANCH:-main}"

cd "${APP_DIR}"
git fetch origin "${BRANCH}"
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

cd "${APP_DIR}/backend"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

php artisan migrate --force
php artisan storage:link || true
php artisan optimize:clear
php artisan optimize

chown -R www-data:www-data storage bootstrap/cache
systemctl reload php8.3-fpm
systemctl reload nginx
supervisorctl restart amar-dokan-worker:* || true

echo "Backend deployment complete."
