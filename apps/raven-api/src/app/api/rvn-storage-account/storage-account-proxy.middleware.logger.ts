import { ConsoleLogger } from '@nestjs/common';

export class StorageAccountProxyMiddlewareLogger extends ConsoleLogger {
  public context = 'StorageAccountProxyMiddleware';
}
