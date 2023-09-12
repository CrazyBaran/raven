import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
  private readonly API_CALL_PATTERN = '/api';

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const { url } = request;

    if (url.startsWith(this.API_CALL_PATTERN)) {
      const urlWithRemovedApiPattern = url.substring(
        this.API_CALL_PATTERN.length
      );

      request = request.clone({
        url: environment.apiUrl + urlWithRemovedApiPattern,
      });
    }

    return next.handle(request);
  }
}
