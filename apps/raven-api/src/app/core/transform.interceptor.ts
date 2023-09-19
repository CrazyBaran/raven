import * as statusCodes from 'builtin-status-codes';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenericResponse } from '@app/rvns-api';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, GenericResponse<T> | StreamableFile>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponse<T> | StreamableFile> {
    const response = context.switchToHttp().getResponse();
    const { statusCode } = response;
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }
        const returnData = {
          statusCode,
          message: statusCodes[statusCode],
        } as GenericResponse<T>;

        if (data !== undefined) {
          returnData.data = data;
        }

        return returnData;
      }),
    );
  }
}
