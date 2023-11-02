import { ConsoleLogger } from '@nestjs/common';

export class AffinityStatusChangedEventHandlerLogger extends ConsoleLogger {
  public context = 'AffinityStatusChangedEventHandler';
}
