FROM dunglas/frankenphp:latest AS base

RUN apt-get update && apt-get install -y libpq-dev postgresql-client && apt-get clean

RUN install-php-extensions \
    pdo_pgsql \
    redis \
    zip \
    intl \
    pcntl \
    bcmath \
    gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

FROM base AS development
ENV APP_ENV=local
ENV FRANKENPHP_CONFIG="worker ./public/index.php"
COPY . .
RUN composer install
RUN php artisan config:clear
ENTRYPOINT ["php", "artisan", "octane:frankenphp"]

FROM base AS production
ENV APP_ENV=prod
ENV FRANKENPHP_CONFIG="worker ./public/index.php"
ENV APP_DEBUG=false

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache

RUN php artisan config:clear
ENTRYPOINT ["php", "artisan", "octane:frankenphp"]