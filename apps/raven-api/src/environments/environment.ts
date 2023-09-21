import * as env from 'env-var';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import * as Bull from '@taskforcesh/bullmq-pro';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

const redisConnectionOptions = {
  host: env.get('REDIS_HOST').default('localhost').asString(),
  port: env.get('REDIS_PORT').default('6380').asPortNumber(),
  password: env.get('REDIS_PASSWORD').default('').asString(),
  db: env.get('REDIS_DB_INDEX').default(1).asInt(),
  tls: { minVersion: 'TLSv1.2' },
  keepAlive: 1000 * 60 * 5, // 5 minutes
} as RedisOptions;

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
  communication: {
    email: {
      connectionString: env
        .get('COMM_EMAIL_CONN_STRING')
        .default('endpoint=azure_comm_endpoint')
        .asString(),
      senders: {
        noReply: {
          address: env
            .get('COMM_EMAIL_SENDERS_NO_REPLY_ADDRESS')
            .default('noreply@curvestone.io')
            .asString(),
          replyTo: {
            address: env
              .get('COMM_EMAIL_SENDERS_NOREPLY_REPLY_TO_ADDRESS')
              .default('replyto@curvestone.io')
              .asString(),
            displayName: env
              .get('COMM_EMAIL_SENDERS_NOREPLY_REPLY_TO_DISPLAY_NAME')
              .default('John Doe')
              .asString(),
          },
        },
      },
      crypto: {
        key: env
          .get('COMM_EMAIL_CRYPTO_KEY')
          .default('Xw9AmgeKjF0FfUk4MBtwj9JG9Zj1Nj3K')
          .asString(),
        initVector: env
          .get('COMM_EMAIL_CRYPTO_IV')
          .default('UY4i4iNzn2LQFijc')
          .asString(),
      },
    },
  },
  upload: {
    maxFileSize: env
      .get('UPLOAD_MAX_FILE_SIZE')
      .default('1048576000') // 100MB
      .asIntPositive(),
    maxFilenameLength: env
      .get('UPLOAD_MAX_FILENAME_LENGTH')
      .default('40')
      .asIntPositive(),
  },
  log: { request: { excludedEndpoints: ['platform/health'] } },
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
      secret: env.get('JWT_SECRET').default('jwtSecret').asString(),
      signOptions: { expiresIn: '2m' },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    } as JwtModuleOptions,
    cookies: {
      secret: env
        .get('SECURITY_COOKIES_SECRET')
        .default('cookieSecret')
        .asString(),
    },
    crypto: {
      key: env
        .get('SECURITY_CRYPTO_KEY')
        .default('YWXglebFVPROr2wnDseQ9X80YS48c4FT')
        .asString(),
      initVector: env
        .get('SECURITY_CRYPTO_IV')
        .default('JgvqXV8ot7xrKlv1')
        .asString(),
    },
    rateLimiting: {
      ttl: env.get('SECURITY_RATE_LIMITING_TTL').default('1').asInt(),
      limit: env.get('SECURITY_RATE_LIMITING_LIMIT').default('15').asInt(),
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
      host: env.get('TYPEORM_HOST').default('localhost').asString(),
      port: env.get('TYPEORM_PORT').default(1433).asPortNumber(),
      database: env.get('TYPEORM_DATABASE').default('test').asString(),
      username: env.get('TYPEORM_USERNAME').default('root').asString(),
      password: env.get('TYPEORM_PASSWORD').default('root').asString(),
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
    identityMetadata: env.get('AD_IDENTITY_METADATA').asString(),
    clientId: env.get('AD_CLIENT_ID').asString(),
    issuer: env.get('AD_ISSUER').asString(),
    audience: env.get('AD_AUDIENCE').asString(),
    authority: env.get('AD_AUTHORITY').asString(),
    redirectUri: env.get('AD_REDIRECT_URI').asString(),
  },
  scopes: {
    apiAccess: env.get('SCOPES_API_ACCESS').asString(),
  },
};
