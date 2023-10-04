import { ConsoleLogger } from '@nestjs/common';

export class AffinityProcessorLogger extends ConsoleLogger {
  public context = 'AffinityProcessor';
}
