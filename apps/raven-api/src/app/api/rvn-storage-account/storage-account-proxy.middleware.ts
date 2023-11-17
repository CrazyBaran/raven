import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  Options,
  RequestHandler,
  createProxyMiddleware,
} from 'http-proxy-middleware';
import { environment } from '../../../environments/environment';
import { RavenLogger } from '../rvn-logger/raven.logger';

@Injectable()
export class StorageAccountProxyMiddleware implements NestMiddleware {
  private readonly proxy: RequestHandler<Request, Response, NextFunction>;
  public constructor(private readonly logger: RavenLogger) {
    this.logger.setContext(StorageAccountProxyMiddleware.name);
    const options = {
      target: `https://${environment.azureStorageAccount.name}.blob.core.windows.net`,
      secure: false,
      pathRewrite: {},
      on: {
        proxyReq: (proxyReq): void => {
          proxyReq.removeHeader('authorization');
          proxyReq.removeHeader('Authorization');
          proxyReq.removeHeader('host');
          proxyReq.setHeader(
            'host',
            `${environment.azureStorageAccount.name}.blob.core.windows.net`,
          );
        },
        proxyRes: (proxyRes): void => {
          proxyRes.headers['Cache-Control'] = 'private, max-age=31536000';
        },
      },
      logger: this.logger,
    } as Options;
    const rewriteUrl = environment.app.apiPrefix
      ? `/${environment.app.apiPrefix}/storage-account`
      : '/storage-account';
    options.pathRewrite[rewriteUrl] = '';
    this.proxy = createProxyMiddleware(options);
  }
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    return this.proxy(req, res, next);
  }
}
