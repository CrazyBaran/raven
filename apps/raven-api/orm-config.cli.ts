import * as env from 'env-var';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

export default {
  type: 'mssql',
  // increase timeout to prevent migrations to fail
  requestTimeout: 600000,
  host: env.get('TYPEORM_HOST').default('localhost').asString(),
  port: env.get('TYPEORM_PORT').default(1433).asPortNumber(),
  username: env.get('TYPEORM_USERNAME').default('root').asString(),
  password: env.get('TYPEORM_PASSWORD').default('root').asString(),
  database: env.get('TYPEORM_DATABASE').default('test').asString(),
  synchronize: false,
  logging: false,
  debug: false,
  trace: false,
  entityPrefix: 'rvn_',
  entities: ['./apps/raven-api/src/**/!(*.dwh).entity.ts'],
  migrations: ['./apps/raven-api/src/migrations/*.ts'],
  migrationsTableName: 'rvn_migrations',
  namingStrategy: new SnakeNamingStrategy(),
  cli: { migrationsDir: './apps/raven-api/src/migrations' },
  options: { enableArithAbort: true },
} as SqlServerConnectionOptions;
