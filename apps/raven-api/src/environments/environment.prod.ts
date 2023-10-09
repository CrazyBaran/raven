import * as env from 'env-var';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import * as Bull from '@taskforcesh/bullmq-pro';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

const redisConnectionOptions = {
  host: env.get('REDIS_HOST').required().asString(),
  port: env.get('REDIS_PORT').default('6380').asPortNumber(),
  password: env.get('REDIS_PASSWORD').required().asString(),
  db: env.get('REDIS_DB_INDEX').default(1).asInt(),
  tls: { minVersion: 'TLSv1.2' },
  keepAlive: 1000 * 60 * 5, // 5 minutes
} as RedisOptions;

export const environment = {
  app: {
    production: true,
    url: env.get('URL').required().asString().replace(/\/$/, ''),
    apiUrl: env.get('URL_API').required().asString().replace(/\/$/, ''),
    apiPrefix: env.get('API_PREFIX').default('').asString(),
    enableSwagger: env.get('SWAGGER_ENABLE').default('false').asBoolStrict(),
    sentryDsn: env.get('SENTRY_DSN').asUrlString(),
    di: {
      semanticSearch: {
        minThresholdFix: env
          .get('APP_DI_SEMANTIC_SEARCH_MIN_THRESHOLD_FIX')
          .default('0.15')
          .asFloat(),
      },
      logPrompts: env.get('APP_DI_LOG_PROMPTS').default('false').asBoolStrict(),
    },
  },
  logs: {
    audit: {
      excludedEndpoints: ['platform/health'],
    },
    request: {
      excludedEndpoints: ['platform/health'],
    },
  },
  communication: {
    email: {
      connectionString: env.get('COMM_EMAIL_CONN_STRING').required().asString(),
      senders: {
        noReply: {
          address: env
            .get('COMM_EMAIL_SENDERS_NO_REPLY_ADDRESS')
            .required()
            .asString(),
          replyTo: {
            address: env
              .get('COMM_EMAIL_SENDERS_NOREPLY_REPLY_TO_ADDRESS')
              .required()
              .asString(),
            displayName: env
              .get('COMM_EMAIL_SENDERS_NOREPLY_REPLY_TO_DISPLAY_NAME')
              .required()
              .asString(),
          },
        },
      },
      crypto: {
        key: env.get('COMM_EMAIL_CRYPTO_KEY').required().asString(),
        initVector: env.get('COMM_EMAIL_CRYPTO_IV').required().asString(),
      },
    },
  },
  upload: {
    maxFileSize: env
      .get('UPLOAD_MAX_FILE_SIZE')
      .default('1073741824') // 1GB
      .asIntPositive(),
    maxFilenameLength: env
      .get('UPLOAD_MAX_FILENAME_LENGTH')
      .default('40')
      .asIntPositive(),
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
    auth: {
      saml: {
        forceDomain: env.get('SECURITY_AUTH_SAML_FORCE_DOMAIN').asString(),
        emailsBypass: env
          .get('SECURITY_AUTH_SAML_EMAILS_BYPASS')
          .default('')
          .asArray(),
      },
    },
    jwt: {
      secret: env.get('JWT_SECRET').required().asString(),
      signOptions: { expiresIn: '2m' },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    } as JwtModuleOptions,
    cookies: {
      secret: env.get('SECURITY_COOKIES_SECRET').required().asString(),
    },
    crypto: {
      key: env.get('SECURITY_CRYPTO_KEY').required().asString(),
      initVector: env.get('SECURITY_CRYPTO_IV').required().asString(),
    },
    rateLimiting: {
      ttl: env.get('API_RATE_LIMITING_TTL').default('1').asInt(),
      limit: env.get('API_RATE_LIMITING_LIMIT').default('15').asInt(),
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
      enable: env.get('BULL_BOARD_ENABLE').default('false').asBoolStrict(),
      readOnly: env.get('BULL_BOARD_READ_ONLY').default('true').asBoolStrict(),
      basicAuth: env.get('BULL_BOARD_AUTH').default('true').asBoolStrict(),
      basicAuthUser: env
        .get('BULL_BOARD_AUTH_USER')
        .default('raven-admin')
        .asString(),
      basicAuthPassword: env
        .get('BULL_BOARD_AUTH_PASSWORD')
        .required()
        .asString(),
    },
  },
  database: {
    orm: {
      type: 'mssql',
      host: env.get('TYPEORM_HOST').required().asString(),
      port: env.get('TYPEORM_PORT').default(1433).asPortNumber(),
      database: env.get('TYPEORM_DATABASE').required().asString(),
      username: env.get('TYPEORM_USERNAME').required().asString(),
      password: env.get('TYPEORM_PASSWORD').required().asString(),
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
      },
      cache: {
        type: 'ioredis',
        options: redisConnectionOptions,
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
  },
  scopes: {
    apiAccess: env.get('SCOPES_API_ACCESS').asString(),
  },
  affinity: {
    enabledOnInit: env
      .get('AFFINITY_ENABLED_ON_INIT')
      .default('true')
      .asBoolStrict(),
  },
  webhookToken: env.get('AFFINITY_WEBHOOK_TOKEN').asString(),
  apiKey: env.get('AFFINITY_API_KEY').asString(),
  listId: env.get('AFFINITY_LIST_ID').asString(),
  fieldId: env.get('AFFINITY_FIELD_ID').asString(),
};
