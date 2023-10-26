import { Configuration, LogLevel } from '@azure/msal-node';
import { environment } from '../../../environments/environment';
import { ConfidentialClientApplicationLogger } from './confidential-client-application.logger';

export const CCA_CONFIG = 'CCA_CONFIG';

export const ccaConfig = (
  logger: ConfidentialClientApplicationLogger,
): Configuration => {
  return {
    auth: {
      clientId: environment.azureAd.clientId,
      authority: environment.azureAd.authority,
      clientSecret: environment.azureAd.clientSecret,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message): void {
          switch (loglevel) {
            case LogLevel.Error: {
              logger.error(message);
              break;
            }
            case LogLevel.Warning: {
              logger.warn(message);
              break;
            }
            case LogLevel.Info: {
              logger.verbose(message);
              break;
            }
            case LogLevel.Verbose: {
              logger.debug(message);
              break;
            }
            case LogLevel.Trace: {
              logger.log(message);
              break;
            }
          }
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Trace,
      },
    },
  } as Configuration;
};
