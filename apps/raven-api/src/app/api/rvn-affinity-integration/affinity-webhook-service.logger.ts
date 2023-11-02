import { ConsoleLogger } from '@nestjs/common';

export class AffinityWebhookServiceLogger extends ConsoleLogger {
  public context = 'AffinityWebhookService';
}
