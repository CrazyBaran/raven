import { NextFunction, Request, Response } from 'express';
import * as morgan from 'morgan';
import { TokenIndexer } from 'morgan';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { environment } from '../../environments/environment';
import { RequestLogger } from './request.logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  public constructor(private readonly logger: RequestLogger) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    if (
      !environment.logs.request.excludedEndpoints.some((ec) =>
        req.baseUrl.includes(ec),
      )
    ) {
      const configuredMorgan = morgan(
        (
          tokens: TokenIndexer<Request, Response>,
          req: Request,
          res: Response,
        ) => {
          return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            `${tokens['response-time'](req, res)}ms`,
            this.resolveEndpointExtra(req, res),
            this.resolveUserTokens(req),
            tokens['remote-addr'](req, res),
            `"${tokens['user-agent'](req, res)}"`,
          ].join(' ');
        },
        {
          stream: {
            write: (message): void =>
              this.logger.log(message.replace('\n', '')),
          },
        },
      );
      configuredMorgan(req, res, next);
    } else {
      next();
    }
  }

  protected resolveEndpointExtra(req: Request, res: Response): string {
    if (res['endpointExtraLogs']) {
      // if the controller sets extra logs, use them
      return `"${res['endpointExtraLogs']}"`;
    }
    if (req.method === 'POST') {
      const path = environment.app.apiPrefix
        ? req.route.path.replace(`/${environment.app.apiPrefix}`, '')
        : req.route.path;
      if (path === '/users') {
        // append extra information for creating user
        return `${req.body['email']}|${req.body['role']}`;
      }

      if (req.body['email']) {
        // all POSTs having append email information for the requests
        return `${req.body['email']}`;
      }
    }
    return 'null';
  }

  protected resolveUserTokens(req: Request): string {
    const tokens = [];
    if (req.user) {
      tokens.push(
        ...[req.user['email'], req.user['id'], req.user['roles']?.join(',')],
      );
    } else {
      tokens.push(...[req.body?.username || 'null', 'null', 'null']);
    }
    return tokens.join('|');
  }
}
