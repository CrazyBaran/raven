import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class RavenLogger extends ConsoleLogger {
  public info(message: string, context?: string): void {
    this.log(message, context);
  }
}
