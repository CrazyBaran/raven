import { NextFunction, Request, Response } from 'express';

import { HttpMethodEnum } from '../../shared/enum/http-method.enum';

import { AuditLogsService } from './audit-logs.service';
import { ActionTypeEnum } from './enums/action-type.enum';
import { AuditLog } from './interfaces/audit-log.interface';
import { ParsedRequest } from './interfaces/parsed-request.interface';
import { AuditLogsLogger } from './loggers/audit-logs.logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../rvn-auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuditLogsMiddleware implements NestMiddleware {
  private apiPrefix = environment.app.apiPrefix.length
    ? `${environment.app.apiPrefix}/`
    : '';
  private loginRoute = `${this.apiPrefix}auth/login`;

  public constructor(
    private readonly logsService: AuditLogsService,
    private readonly authService: AuthService,
    private readonly logger: AuditLogsLogger,
  ) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    if (this.verifyRequest(req)) {
      const parsedRequest = this.parseRequest(req);
      const user = this.getUserFromRequest(parsedRequest);

      res.on('finish', async () => {
        try {
          const { statusCode } = res;
          const actionType = this.getActionType(parsedRequest, statusCode);
          const auditLog: AuditLog = {
            user: user,
            module: parsedRequest.module,
            actionType: actionType,
            actionResult: statusCode,
            query: parsedRequest.query,
            body: parsedRequest.body,
            httpMethod: parsedRequest.httpMethod,
            controller: parsedRequest.controller,
          };
          if (
            !environment.logs.audit.excludedEndpoints.some((ec) =>
              auditLog.controller.includes(ec),
            )
          ) {
            await this.logsService.create(auditLog);
          }
        } catch (ex) {
          this.logger.error(`${ex.name} > ${ex.message}`);
        }
      });
    }

    next();
  }

  public verifyRequest(req: Request): boolean {
    return Object.values<string>(HttpMethodEnum).includes(req.method);
  }

  public parseRequest(req: Request): ParsedRequest {
    const { method, originalUrl, body } = req;
    const url = new URL(originalUrl, `${req.protocol}://${req.hostname}`);
    const module = url.pathname.replace(`${this.apiPrefix}`, '').split('/')[1];
    const parsedQuery = url.search.length ? url.search.replace('?', '') : null;
    const parsedBody = Object.keys(body).length
      ? ({ ...body } as Record<string, unknown>)
      : null;
    const httpMethod = HttpMethodEnum[method];
    const controller = url.pathname.replace('/', '');
    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')[1]
      : null;

    if (controller === this.loginRoute) {
      delete parsedBody.password;
    }

    return {
      module,
      query: parsedQuery,
      body: parsedBody,
      httpMethod,
      controller,
      token,
    } as ParsedRequest;
  }

  private getActionType(
    parsedRequest: ParsedRequest,
    statusCode: number,
  ): ActionTypeEnum {
    let actionType: ActionTypeEnum = this.logsService.getActionEnum(
      parsedRequest.httpMethod,
    );

    if (
      parsedRequest.httpMethod === HttpMethodEnum.POST &&
      statusCode === 201
    ) {
      actionType = ActionTypeEnum.Create;
    }
    if (parsedRequest.controller === this.loginRoute) {
      actionType = ActionTypeEnum.Login;
    }

    return actionType;
  }

  private getUserFromRequest(parsedRequest: ParsedRequest): string {
    let user = 'unknown';

    if (parsedRequest.token) {
      const tokenData = this.authService.decodeToken(parsedRequest.token);
      if (
        // make sure that tokenData is not falsy (typeof null === 'object')
        tokenData &&
        typeof tokenData === 'object' &&
        (tokenData.email || tokenData.unique_name)
      ) {
        user = tokenData.email
          ? `${tokenData.email}`
          : `${tokenData.unique_name}`;
      }
    } else if (parsedRequest.body && parsedRequest.body.username) {
      user = `${parsedRequest.body.username}`;
    }
    return user;
  }
}
