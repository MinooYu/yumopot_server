FROM php:8.1-fpm-buster

ENV COMPOSER_ALLOW_SUPERUSER=1 \
  COMPOSER_HOME=/composer

COPY --from=node:20.5.1 /usr/local/bin /usr/local/bin
COPY --from=node:20.5.1 /usr/local/lib /usr/local/lib

COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
  apt-get -y install --no-install-recommends git unzip libzip-dev libicu-dev libonig-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  docker-php-ext-install intl pdo_mysql zip bcmath

# RUN pecl install redis

# RUN echo extension=redis.so >> /usr/local/etc/php/conf.d/redis.ini

COPY ./php.ini /usr/local/etc/php/php.ini

WORKDIR /data
