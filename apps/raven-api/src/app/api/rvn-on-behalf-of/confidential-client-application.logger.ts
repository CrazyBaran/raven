import { ConsoleLogger } from '@nestjs/common';

export class ConfidentialClientApplicationLogger extends ConsoleLogger {
  public context = 'ConfidentialClientApplication';
}
