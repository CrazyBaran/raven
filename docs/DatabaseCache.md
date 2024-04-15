Database & Cache
================

[← CI/CD](CiCd.md) | [ToC ↑](../README.md)  | [API Design →](ApiDesign.md)

## Database

Database is created and managed by the TypeORM within NestJS's backend. It runs on MSSQL within Azure infrastructure. 

The database's tables are prefixed with `rvn_`, as per TypeORM's configuration. There are a lot of tables that fulfill different purposes. The easiest way to find them in the code is to look for `*.entity.ts` files which should contain definitions of entities that would be a building block for tables.

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

## Cache

There is a single Redis instance that is used for both general caching purposes and BullMQ queue. The cache is used for storing data that is expensive to fetch or calculate (so both Affinity and Data Warehouse integration data lands here), and the queue is used for managing background jobs.
