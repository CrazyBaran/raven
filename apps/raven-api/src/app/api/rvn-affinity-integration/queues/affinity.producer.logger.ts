import { ConsoleLogger } from '@nestjs/common';

export class AffinityProducerLogger extends ConsoleLogger {
  public context = 'AffinityProducer';
}
