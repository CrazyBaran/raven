import { ConsoleLogger } from '@nestjs/common';

export class StorageAccountProxyMiddlewareLogger extends ConsoleLogger {
  public context = 'StorageAccountProxyMiddleware';

  public info(message: string, context?: string) {
    this.log(message, context);
  }
}
