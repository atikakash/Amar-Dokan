FROM composer:2 AS vendor

WORKDIR /app
COPY backend/composer.json ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-req=ext-pcntl

FROM php:8.4-fpm-alpine AS runtime

WORKDIR /var/www/html

RUN apk add --no-cache \
        bash \
        curl \
        icu-dev \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
        tzdata \
        zip \
    && docker-php-ext-install \
        bcmath \
        intl \
        mbstring \
        opcache \
        pdo_mysql \
        zip

COPY --from=vendor /app/vendor ./vendor
COPY backend .
COPY docker/php/entrypoint.sh /usr/local/bin/ecommerce-entrypoint
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/production.ini /usr/local/etc/php/conf.d/production.ini

RUN mkdir -p storage/app/public storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && php artisan package:discover --ansi \
    && chmod +x /usr/local/bin/ecommerce-entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

ENTRYPOINT ["ecommerce-entrypoint"]
CMD ["php-fpm"]
