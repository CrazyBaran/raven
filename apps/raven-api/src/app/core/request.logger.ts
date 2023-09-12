import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class RequestLogger extends ConsoleLogger {
  public readonly context = 'Request';
}
