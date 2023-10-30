import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { CCA_CONFIG, ccaConfig } from './cca.config';
import { ConfidentialClientApplicationLogger } from './confidential-client-application.logger';
import { CcaTokenCacheEntity } from './entities/cca-token-cache.entity';
import { OnBehalfOfController } from './on-behalf-of.controller';
import { PartitionManager } from './partition.manager';
import { TypeOrmTokenCacheClient } from './type-orm-token-cache.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([CcaTokenCacheEntity]),
    ConfigModule,
    ClsModule.forFeature(),
  ],
  providers: [
    TypeOrmTokenCacheClient,
    PartitionManager,
    ConfidentialClientApplicationLogger,
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
  ],
  controllers: [OnBehalfOfController],
  exports: [ConfidentialClientApplication],
})
export class OnBehalfOfModule {}
