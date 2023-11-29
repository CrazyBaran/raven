import { CryptoModule } from '@app/rvnb-crypto';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { environment } from '../../../environments/environment';
import { CCA_CONFIG, ccaConfig } from './cca.config';
import { ConfidentialClientApplicationLogger } from './confidential-client-application.logger';
import { CustomAuthenticationProvider } from './custom-authentication.provider';
import { CcaTokenCacheEntity } from './entities/cca-token-cache.entity';
import { OpportunityCreatedEventHandler } from './event-handlers/opportunity-created.event.handler';
import { OnBehalfOfController } from './on-behalf-of.controller';
import { PartitionManager } from './partition.manager';
import { TypeOrmTokenCacheClient } from './type-orm-token-cache.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([CcaTokenCacheEntity]),
    ConfigModule,
    ClsModule.forFeature(),
    CryptoModule.register({
      key: environment.azureAd.ccaCacheEncryptionKey,
      initVector: environment.azureAd.ccaCacheEncryptionInitVector,
    }),
  ],
  providers: [
    TypeOrmTokenCacheClient,
    PartitionManager,
    ConfidentialClientApplicationLogger,
    CustomAuthenticationProvider,
    {
      provide: ConfidentialClientApplication,
      useFactory: (
        configuration: Configuration,
      ): ConfidentialClientApplication => {
        return new ConfidentialClientApplication(configuration);
      },
      inject: [CCA_CONFIG],
    },
    {
      provide: CCA_CONFIG,
      useFactory: ccaConfig,
      inject: [
        TypeOrmTokenCacheClient,
        PartitionManager,
        ConfidentialClientApplicationLogger,
      ],
    },
    {
      provide: Client,
      useFactory: (
        authenticationProvider: CustomAuthenticationProvider,
      ): Client => {
        const clientOptions: ClientOptions = {
          authProvider: authenticationProvider,
        };
        return Client.initWithMiddleware(clientOptions);
      },
      inject: [CustomAuthenticationProvider],
    },
    OpportunityCreatedEventHandler,
  ],
  controllers: [OnBehalfOfController],
  exports: [ConfidentialClientApplication],
})
export class OnBehalfOfModule {}
