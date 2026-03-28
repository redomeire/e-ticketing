FROM docker.io/dunglas/frankenphp:latest AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions \
    pdo_pgsql \
    redis \
    zip \
    intl \
    pcntl \
    bcmath \
    gd

COPY --from=docker.io/library/composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

FROM base AS development

ENV APP_ENV=local

COPY . .
RUN composer install

FROM base AS production

ENV APP_ENV=production
ENV APP_DEBUG=false

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache