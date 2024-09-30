import { CryptoModule } from '@app/rvnb-crypto';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { environment } from '../../../environments/environment';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';
import { CCA_CONFIG, ccaConfig } from './cca.config';
import { ConfidentialClientApplicationLogger } from './confidential-client-application.logger';
import { CustomAuthenticationProvider } from './custom-authentication.provider';
import { CcaTokenCacheEntity } from './entities/cca-token-cache.entity';
import { OpportunityCreatedEventHandler } from './event-handlers/opportunity-created.event.handler';
import { OnBehalfOfController } from './on-behalf-of.controller';
import { PartitionManager } from './partition.manager';
import { TypeOrmTokenCacheClient } from './type-orm-token-cache.client';
import { SharepointMigrationService } from './sharepoint-migration.service';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { FileEntity } from '../rvn-files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CcaTokenCacheEntity, OrganisationEntity, OpportunityEntity, FileEntity]),
    ConfigModule,
    ClsModule.forFeature(),
    CryptoModule.register({
      key: environment.azureAd.ccaCacheEncryptionKey,
      initVector: environment.azureAd.ccaCacheEncryptionInitVector,
    }),
    WebSocketsModule,
  ],
  providers: [
    TypeOrmTokenCacheClient,
    PartitionManager,
    ConfidentialClientApplicationLogger,
    CustomAuthenticationProvider,
    SharepointMigrationService,
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
