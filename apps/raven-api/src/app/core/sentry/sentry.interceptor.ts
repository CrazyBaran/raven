import { catchError, finalize, Observable, throwError } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryService } from './sentry.service';

@Injectable({ scope: Scope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  public constructor(private sentryService: SentryService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    // start a child span for performance tracing
    const span = this.sentryService.startChild({
      op: `route handler`,
      description: 'performance',
    });

    return next.handle().pipe(
      catchError((error) => {
        // capture the error
        Sentry.captureException(
          error,
          //this.sentryService.span.getTraceContext(),
        );

        // throw the error again
        return throwError(() => error);
      }),
      finalize(() => {
        span.finish();
        this.sentryService.span.finish();
      }),
    );
  }
}
