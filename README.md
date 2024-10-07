# Bot v2 API

## Prerequisite

[Nodejs 18](https://github.com/nvm-sh/nvm)
[Docker + Docker Compose](https://github.com/docker/docker-install)
[Yarn] `npm i -g yarn`

## Getting started

```bash
# 1. Enter your newly-cloned folder.
cd botv2-api

# 2. Create Environment variables file.
cp .env.example .env

# 3. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn

# 4. Run DB
docker compose up
```

### Development

```bash
# 4. Run development server and open http://localhost:3000
yarn watch:dev

# 5. Read the documentation linked below for "Setup and development".
```

### Generate migration

Generated migrations will appear in ./src/database/migrations/

```bash
yarn migration:generate ${your_migration_name}

#Example
yarn migration:generate add-post-table
```

### Build

To build the App, run

```bash
yarn build:prod
```

And you will see the generated file in `dist` that ready to be served.

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
2.  [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
3.  [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)
