import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestHandler, createProxyMiddleware } from 'http-proxy-middleware';
import { environment } from '../../../environments/environment';
import { StorageAccountProxyMiddlewareLogger } from './storage-account-proxy.middleware.logger';

@Injectable()
export class StorageAccountProxyMiddleware implements NestMiddleware {
  private readonly proxy: RequestHandler;
  constructor(private readonly logger: StorageAccountProxyMiddlewareLogger) {
    this.proxy = createProxyMiddleware({
      target: `https://${environment.azureStorageAccount.name}.blob.core.windows.net`,
      pathRewrite: {
        '/api/storage-account': '',
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('authorization');
        proxyReq.removeHeader('host');
        proxyReq.setHeader(
          'host',
          `${environment.azureStorageAccount.name}.blob.core.windows.net`,
        );
        this.logger.debug(
          `Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        );
        console.log(proxyReq);
      },
      onProxyRes: (proxyRes, req, res) => {
        this.logger.debug(
          `Request ${req.method} originally made to '${req.originalUrl}' has been proxied.`,
        );
        console.log(proxyRes);
      },
    });
  }
  use(req: any, res: any, next: (error?: any) => void): any {
    this.proxy(req, res, next);
  }
}
