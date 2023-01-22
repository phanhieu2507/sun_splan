ARG REGISTRY_PATH
ARG TAG

#### PHP
FROM ${REGISTRY_PATH}/laravel-app:${TAG} as laravel

#### Web service (Nginx + PHP-FPM)
FROM sunasteriskrnd/php:8.1-nginx-alpine3.15

COPY rootfs /

WORKDIR /srv/app

COPY --from=laravel /composer/vendor vendor
COPY --from=laravel /srv/app .
COPY --from=laravel /composer-autoload vendor

RUN chown -R www-data:www-data storage bootstrap/cache

ENV DOCUMENT_ROOT=/srv/app/public
ENV PHP_FPM.pm=ondemand
ENV PHP_FPM.pm.max_children=40

ENTRYPOINT [ "docker-entrypoint" ]
