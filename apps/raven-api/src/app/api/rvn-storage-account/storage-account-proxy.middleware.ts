import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestHandler, createProxyMiddleware } from 'http-proxy-middleware';
import { environment } from '../../../environments/environment';
import { StorageAccountProxyMiddlewareLogger } from './storage-account-proxy.middleware.logger';

@Injectable()
export class StorageAccountProxyMiddleware implements NestMiddleware {
  private readonly proxy: RequestHandler<Request, Response, NextFunction>;
  public constructor(
    private readonly logger: StorageAccountProxyMiddlewareLogger,
  ) {
    this.proxy = createProxyMiddleware({
      target: `https://${environment.azureStorageAccount.name}.blob.core.windows.net`,
      pathRewrite: {
        '/api/storage-account': '',
      },
      secure: false,
      on: {
        proxyReq: (proxyReq) => {
          proxyReq.removeHeader('authorization');
          proxyReq.removeHeader('host');
          proxyReq.setHeader(
            'host',
            `${environment.azureStorageAccount.name}.blob.core.windows.net`,
          );
        },
      },
      logger: this.logger,
    });
  }
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return this.proxy(req, res, next);
  }
}
