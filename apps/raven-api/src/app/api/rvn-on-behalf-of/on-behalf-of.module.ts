import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { Module } from '@nestjs/common';
import { CCA_CONFIG, ccaConfig } from './cca.config';
import { ConfidentialClientApplicationLogger } from './confidential-client-application.logger';
import { OnBehalfOfController } from './on-behalf-of.controller';

@Module({
  imports: [],
  providers: [
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
      inject: [ConfidentialClientApplicationLogger],
    },
  ],
  controllers: [OnBehalfOfController],
  exports: [ConfidentialClientApplication],
})
export class OnBehalfOfModule {}
