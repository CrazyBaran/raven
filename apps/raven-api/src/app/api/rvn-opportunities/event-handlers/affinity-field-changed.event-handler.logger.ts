import { ConsoleLogger } from '@nestjs/common';

export class AffinityFieldChangedEventHandlerLogger extends ConsoleLogger {
  public context = 'AffinityFieldChangedEventHandler';
}
