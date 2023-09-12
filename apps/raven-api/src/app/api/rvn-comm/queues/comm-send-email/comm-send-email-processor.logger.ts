import { ConsoleLogger } from '@nestjs/common';

export class CommSendEmailProcessorLogger extends ConsoleLogger {
  public context = 'CommSendEmailProcessor';
}
