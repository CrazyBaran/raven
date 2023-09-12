import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class GatewayServiceLogger extends ConsoleLogger {
  public readonly context = 'GatewayService';
}
