import { ConsoleLogger } from '@nestjs/common';

export class OpportunityProcessorLogger extends ConsoleLogger {
  public context = 'OpportunityProcessor';
}
