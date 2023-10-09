import { ConsoleLogger } from '@nestjs/common';

export class OpportunityProducerLogger extends ConsoleLogger {
  public context = 'OpportunityProducer';
}
