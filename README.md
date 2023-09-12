# Raven App

Go to [Nx](https://nx.dev) to find all the nx commands.

## Install

Make sure you have login creds for MSSQL DB. Can be remote or local. Set them up as described in [Database](#database) part.

Run: `npm install`

## Dev run

Run in separate terminals:
- `nx serve raven-api`
- `nx serve raven-client`

or all at once in parallel mode:

- `nx run-many --target=serve --projects=raven-api,raven-client --parallel`

### Using Swagger

Swagger API definition is available only in non production builds.

To see definitions please run `api` app (`nx serve api`) and visit: http://localhost:3333/api/

For details on using OpenApi please visit: https://docs.nestjs.com/openapi/introduction

## Database

Project uses MSSQL database. Connection configuration can be set via env vars:

```bash
TYPEORM_HOST="localhost"
TYPEORM_PORT="1433"
TYPEORM_USERNAME="root"
TYPEORM_PASSWORD="root"
TYPEORM_DATABASE="test"
```

The example above shows defaults set in the project.

### Migrations

Project uses [TypeORM](https://typeorm.io/) migrations to manage DB structure.

The project uses npm to run typeorm scripts because of translating TypeScript to JavaScript on the flight as TypeORM is written for JavaScript.

#### Auto generate

Migration can be generated automatically based on connected DB and entities in code:
```bash
npm run typeorm -- migration:generate apps/raven-api/src/migrations/MigrationName
```

#### Custom migration

Custom migration can be generated using create command:
```bash
npm run typeorm -- migration:create apps/raven-api/src/migrations/MigrationName
```

#### Apply migrations:
```bash
npm run typeorm -- migration:run
```

#### Revert migration:
```bash
npm run typeorm -- migration:revert
```

More details on migrations can be found in [documentation](https://typeorm.io/#/migrations) or in [examples](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md).


## Library naming convention
Each library should follow a naming convention. To do that we should remember to add the correct prefix before the library name. At this moment we're agreed that we will be using 3 prefixes.

- `rvnb-[name]` - Back-End (API) libraries
- `rvnc-[name]` - Front-End libraries
- `rvns-[name]` - Shared libraries
