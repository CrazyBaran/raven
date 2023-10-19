import { Request } from 'express';

import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { Span, SpanContext } from '@sentry/types';

@Injectable({ scope: Scope.REQUEST })
export class SentryService {
  public constructor(@Inject(REQUEST) private request: Request) {
    const { method, headers, url } = this.request;

    // recreate transaction based on HTTP request
    const transaction = Sentry.startTransaction({
      name: `Route: ${method} ${url}`,
      op: 'transaction',
    });

    // setup context of newly created transaction
    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);

      // customize context
      scope.setContext('http', {
        method,
        url,
        headers,
      });
    });
  }

  public get span(): Span {
    return Sentry.getCurrentHub().getScope().getSpan();
  }

  public startChild(spanContext: SpanContext): Span {
    return this.span.startChild(spanContext);
  }
}
