import { ConsoleLogger } from '@nestjs/common';

export class InvalidateSessionEventHandlerLogger extends ConsoleLogger {
  public context = 'InvalidateSessionEventHandler';
}
