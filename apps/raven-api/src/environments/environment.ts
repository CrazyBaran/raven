import * as env from 'env-var';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import * as Bull from '@taskforcesh/bullmq-pro';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

const redisConnectionOptions = {
  host: env.get('REDIS_HOST').default('localhost').asString(),
  port: env.get('REDIS_PORT').default('6380').asPortNumber(),
  password: env.get('REDIS_PASSWORD').default('').asString(),
  db: env.get('REDIS_DB_INDEX').default(1).asInt(),
  tls: { minVersion: 'TLSv1.2' },
  keepAlive: 1000 * 60 * 5, // 5 minutes,
  retryStrategy: (times: number): number =>
    times > 20 ? undefined : times * 2000,
} as RedisOptions;

const getAppDBAuthOptions =
  (): SqlServerConnectionCredentialsAuthenticationOptions => {
    const authType = env.get('TYPEORM_AUTH_TYPE').default('default').asString();

    switch (authType) {
      case 'default':
        return {
          type: 'default',
          options: {
            userName: env.get('TYPEORM_USERNAME').asString(),
            password: env.get('TYPEORM_PASSWORD').asString(),
          },
        } as SqlServerConnectionCredentialsAuthenticationOptions;
      case 'azure-active-directory-default':
        return {
          type: 'azure-active-directory-default',
        } as SqlServerConnectionCredentialsAuthenticationOptions;
      default:
        return {
          type: 'default',
          options: {},
        };
    }
  };

export const environment = {
  app: {
    production: false,
    url: env
      .get('URL')
      .default('http://localhost:4200')
      .asString()
      .replace(/\/$/, ''),
    apiUrl: env
      .get('URL_API')
      .default('http://127.0.0.1:3333')
      .asString()
      .replace(/\/$/, ''),
    apiPrefix: env.get('API_PREFIX').default('api').asString(),
    enableSwagger: env.get('SWAGGER_ENABLE').default('true').asBoolStrict(),
    sentryDsn: env.get('SENTRY_DSN').asUrlString(),
  },
  logs: {
    audit: {
      excludedEndpoints: ['platform/health'],
    },
    request: {
      excludedEndpoints: ['platform/health'],
    },
  },
  cache: {
    store: {
      redis: {
        options: { ...redisConnectionOptions, keyPrefix: 'rvn:cache:' },
      },
    },
  },
  security: {
    acl: {
      cache: {
        enabled: env.get('ACL_CACHE_ENABLED').default('true').asBoolStrict(),
        redis: {
          cacheKey: env
            .get('ACL_CACHE_REDIS_CACHE_KEY')
            .default('acl')
            .asString(),
        },
      },
    },
    cookies: {
      secret: env
        .get('SECURITY_COOKIES_SECRET')
        .default('cookieSecret')
        .asString(),
    },
    rateLimiting: {
      ttl: env.get('API_RATE_LIMITING_TTL').default('1').asInt(),
      limit: env.get('API_RATE_LIMITING_TTL').default('15').asInt(),
    },
    bcryptSaltRounds: 10,
  },
  bull: {
    config: {
      connection: {
        ...redisConnectionOptions,
        skipVersionCheck: true, // mute Redis 6.2 recommendation from BullMQ
      },
    } as Bull.QueueProOptions,
    board: {
      enable: env.get('BULL_BOARD_ENABLE').default('true').asBoolStrict(),
      readOnly: env.get('BULL_BOARD_READ_ONLY').default('false').asBoolStrict(),
      basicAuth: env.get('BULL_BOARD_AUTH').default('false').asBoolStrict(),
      basicAuthUser: env
        .get('BULL_BOARD_AUTH_USER')
        .default('raven-admin')
        .asString(),
      basicAuthPassword: env
        .get('BULL_BOARD_AUTH_PASSWORD')
        .default('***')
        .asString(),
    },
  },
  database: {
    orm: {
      type: 'mssql',
      requestTimeout: 60000,
      host: env.get('TYPEORM_HOST').default('localhost').asString(),
      port: env.get('TYPEORM_PORT').default(1433).asPortNumber(),
      database: env.get('TYPEORM_DATABASE').default('test').asString(),
      authentication: getAppDBAuthOptions(),
      synchronize: false,
      logging: false,
      debug: false,
      trace: false,
      entityPrefix: 'rvn_',
      entities: [],
      subscribers: [],
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      options: {
        enableArithAbort: true,
        useUTC: true,
        encrypt: true,
        trustServerCertificate: true,
      },
      cache: {
        type: 'ioredis',
        options: redisConnectionOptions,
      },
      pool: {
        max: 100,
        min: 1,
      },
    } as SqlServerConnectionOptions,
    redis: {
      options: redisConnectionOptions,
    },
  },
  azureAd: {
    identityMetadata: env
      .get('AD_IDENTITY_METADATA')
      .default(
        `https://login.microsoftonline.com/${env
          .get('AD_TENANT_ID')
          .asString()}/v2.0/.well-known/openid-configuration`,
      )
      .asString(),
    clientId: env.get('AD_CLIENT_ID').asString(),
    clientSecret: env.get('AD_CLIENT_SECRET').asString(),
    issuer: env
      .get('AD_ISSUER')
      .default(`https://sts.windows.net/${env.get('AD_TENANT_ID').asString()}/`)
      .asString(),
    audience: env.get('AD_AUDIENCE').asString(),
    authority: env
      .get('AD_AUTHORITY')
      .default(
        `https://login.microsoftonline.com/${env
          .get('AD_TENANT_ID')
          .asString()}`,
      )
      .asString(),
    redirectUri: env.get('AD_REDIRECT_URI').asString(),
    tokenKeys: {
      azureId: env.get('AD_TOKEN_KEYS_AZURE_ID').default('oid').asString(),
      name: env.get('AD_TOKEN_KEYS_NAME').default('name').asString(),
      email: env.get('AD_TOKEN_KEYS_EMAIL').default('unique_name').asString(),
      roles: env.get('AD_TOKEN_KEYS_ROLES').default('roles').asString(),
    },
    shouldEncryptCcaCache: env
      .get('AD_SHOULD_ENCRYPT_CCA_CACHE')
      .default('false')
      .asBoolStrict(),
    ccaCacheEncryptionKey: env.get('AD_CCA_CACHE_ENCRYPTION_KEY').asString(),
    ccaCacheEncryptionInitVector: env
      .get('AD_CCA_CACHE_ENCRYPTION_INIT_VECTOR')
      .asString(),
  },
  scopes: {
    apiAccess: env.get('SCOPES_API_ACCESS').asString(),
  },
  affinity: {
    enabledOnInit: env
      .get('AFFINITY_ENABLED_ON_INIT')
      .default('true')
      .asBoolStrict(),
    dataWatchdogEnabled: env
      .get('AFFINITY_DATA_WATCHDOG_ENABLED')
      .default('true')
      .asBoolStrict(),
    webhookToken: env.get('AFFINITY_WEBHOOK_TOKEN').asString(),
    apiKey: env.get('AFFINITY_API_KEY').asString(),
    affinityUrl: env.get('AFFINITY_URL').asString(),
  },
  azureStorageAccount: {
    name: env.get('AZURE_STORAGE_ACCOUNT_NAME').asString(),
    connectionString: env
      .get('AZURE_STORAGE_ACCOUNT_CONNECTION_STRING')
      .asString(),
    createIfNotExists: env
      .get('AZURE_STORAGE_ACCOUNT_CREATE_IF_NOT_EXISTS')
      .default('true')
      .asBoolStrict(),
  },
  sharePoint: {
    rootDirectory: env
      .get('SHAREPOINT_ROOT_DIRECTORY')
      .default('Raven')
      .asString(),
    driveId: env.get('SHAREPOINT_DRIVE_ID').asString(),
    siteId: env.get('SHAREPOINT_SITE_ID').asString(),
    rootDirectoryId: env.get('SHAREPOINT_ROOT_DIRECTORY_ID').asString(),
    companyDirectories: env
      .get('SHAREPOINT_COMPANY_DIRECTORIES')
      .default('Received from Company,Research,Model,Output,Legal')
      .asArray(),
  },
  opportunitySync: {
    enabledOnWebhook: env
      .get('ENABLE_CREATE_OPPORTUNITY_ON_WEBHOOK')
      .default('false')
      .asBoolStrict(),
    enabledOnInit: env
      .get('ENABLE_CREATE_OPPORTUNITY_ON_INIT')
      .default('false')
      .asBoolStrict(),
  },
  dataWarehouse: {
    authType: env
      .get('DWH_AUTH_TYPE')
      .default('azure-active-directory-default')
      .asString(),
    version: env.get('DWH_VERSION').default('v2').asString(),
    defaultAuth: {
      userName: env.get('DWH_USERNAME').asString(),
      password: env.get('DWH_PASSWORD').asString(),
    },
    database: {
      type: 'mssql',
      requestTimeout: 60000,
      host: env.get('DWH_HOST').asString(),
      port: env.get('DWH_PORT').default(1433).asPortNumber(),
      database: env.get('DWH_DATABASE').asString(),
      synchronize: false,
      logging: false,
      debug: false,
      trace: false,
      entities: [],
      subscribers: [],
      autoLoadEntities: true,
      options: {
        enableArithAbort: true,
        useUTC: true,
        encrypt: true,
      },
      cache: {
        type: 'ioredis',
        options: redisConnectionOptions,
      },
      pool: {
        max: 100,
        min: 1,
      },
    } as SqlServerConnectionOptions,
    enableProxyRegeneration: env
      .get('DWH_ENABLE_PROXY_REGENERATION')
      .default('false')
      .asBoolStrict(),
  },
  features: {
    dataWareHouse: env
      .get('FEATURE_DATA_WAREHOUSE')
      .default('true')
      .asBoolStrict(),
  },
};
