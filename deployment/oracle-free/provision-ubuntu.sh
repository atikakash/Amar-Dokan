#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/amar-dokan}"
REPO_URL="${REPO_URL:-https://github.com/NexyraSoft/Amar-Dokan.git}"
API_DOMAIN="${API_DOMAIN:-_}"
DB_NAME="${DB_NAME:-amar_dokan}"
DB_USER="${DB_USER:-amar_dokan}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)}"
ENABLE_SSL="${ENABLE_SSL:-0}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script with sudo."
  exit 1
fi

echo "Installing Ubuntu packages..."
apt-get update
apt-get install -y \
  ca-certificates curl git unzip nginx mysql-server supervisor ufw certbot python3-certbot-nginx \
  php8.3 php8.3-cli php8.3-fpm php8.3-bcmath php8.3-curl php8.3-intl php8.3-mbstring \
  php8.3-mysql php8.3-xml php8.3-zip

if ! command -v composer >/dev/null 2>&1; then
  echo "Installing Composer..."
  curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
  php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
  rm -f /tmp/composer-setup.php
fi

echo "Configuring MySQL..."
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost'; FLUSH PRIVILEGES;"

echo "Cloning or updating repository..."
mkdir -p "$(dirname "${APP_DIR}")"
if [[ -d "${APP_DIR}/.git" ]]; then
  git -C "${APP_DIR}" pull --ff-only
else
  git clone "${REPO_URL}" "${APP_DIR}"
fi

cd "${APP_DIR}/backend"

echo "Preparing Laravel environment..."
if [[ ! -f .env ]]; then
  cp .env.oracle.example .env
  APP_SCHEME="http"
  if [[ "${ENABLE_SSL}" == "1" && "${API_DOMAIN}" != "_" ]]; then
    APP_SCHEME="https"
  fi
  sed -i "s#APP_URL=https://api.example.com#APP_URL=${APP_SCHEME}://${API_DOMAIN}#g" .env
  sed -i "s#DB_DATABASE=amar_dokan#DB_DATABASE=${DB_NAME}#g" .env
  sed -i "s#DB_USERNAME=amar_dokan#DB_USERNAME=${DB_USER}#g" .env
  sed -i "s#DB_PASSWORD=change_this_strong_password#DB_PASSWORD=${DB_PASSWORD}#g" .env
fi

composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

php artisan migrate --force
php artisan storage:link || true
php artisan optimize

echo "Configuring Nginx..."
sed "s#__API_DOMAIN__#${API_DOMAIN}#g" "${APP_DIR}/deployment/oracle-free/nginx-api.conf" > /etc/nginx/sites-available/amar-dokan-api
ln -sf /etc/nginx/sites-available/amar-dokan-api /etc/nginx/sites-enabled/amar-dokan-api
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx php8.3-fpm mysql supervisor
systemctl restart php8.3-fpm nginx mysql

echo "Configuring Laravel queue worker..."
cat >/etc/supervisor/conf.d/amar-dokan-worker.conf <<EOF
[program:amar-dokan-worker]
process_name=%(program_name)s_%(process_num)02d
command=php ${APP_DIR}/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=${APP_DIR}/backend/storage/logs/worker.log
stopwaitsecs=3600
EOF
supervisorctl reread
supervisorctl update
supervisorctl restart amar-dokan-worker:* || true

echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

if [[ "${ENABLE_SSL}" == "1" && "${API_DOMAIN}" != "_" ]]; then
  echo "Requesting Let's Encrypt SSL certificate..."
  certbot --nginx -d "${API_DOMAIN}" --non-interactive --agree-tos -m "admin@${API_DOMAIN}" --redirect || true
fi

cat <<EOF

Done.

API URL:
  http://${API_DOMAIN}

Database:
  name: ${DB_NAME}
  user: ${DB_USER}
  password: ${DB_PASSWORD}

Save this database password somewhere safe.
Next, update backend/.env CORS_ALLOWED_ORIGINS after you deploy the Vercel apps.
EOF
