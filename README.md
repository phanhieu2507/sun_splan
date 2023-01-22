# Laravel NextJS Starter template

## Requirement

- Docker >= 20.10
- Docker compose plugin

Preferred for convenience during development:

- PHP 8.1
- NodeJS 16

If you don't have the dependencies above, you can still use the ones provided inside docker containers.

## Setup development environment

Run the following command in the root of project to bootstrap the development environment.

```sh
make devup
```

A `.env` file will be created in the project's root directory.
You can customize development environment to your preferences by editing it.

Install dependencies and run migrations.

```sh
make devinstall
make devmigrate
```

Start the web app in development mode.

```sh
make devrun
```

The web app will be available at your configured domain and port, by default it's `project.localhost:8000`.

## Using docker
### Getting inside containers

To get inside a container you can use

```sh
./project sh <service>
```

e.g

```sh
./project sh php
```

If you are not inside this folder, you can use `docker exec` to enter containers. Most containers uses `alpine` image so you can get into them with `sh`

```sh
docker exec -it <container_name> sh
```

### Running commands in container

You can run commands like this

```sh
./project exec <service> <command>
```

Example

```sh
./project exec php artisan tinker
```

### Running tests

When using docker, PHP test cases must be run inside the `php` container.

```sh
./project sh php
```

When inside the container, run tests with

```sh
composer test
```

Make sure all tests've passed locally before you comit your works.

### PHP Coding Style

PHP code follows [sun-asterisk/coding-standard](https://github.com/sun-asterisk-research/php-coding-standard).

To run `phpcs`, must be run inside the `php` container:

```sh
composer sniff
```

Errors marked as fixable can be fixed automatically with:

```sh
composer autofix
```

### JavaScript Coding Style

JavaScript code follows our own defined ruleset.

To run `eslint` to check your code, must be run inside the `node` container.:

```sh
yarn lint
```

Errors marked as fixable can be fixed automatically with:

```sh
yarn lint --fix
```
## Read more

Relevant documentations:

- [Laravel documentation](https://laravel.com/docs)
- [NextJS documentation](https://nextjs.org/docs)
- [ReactJS documentation](https://reactjs.org/docs)
- [Ant design documentation](https://ant.design/components)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
