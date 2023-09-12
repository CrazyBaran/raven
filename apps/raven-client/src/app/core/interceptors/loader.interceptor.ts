import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { finalize, Observable } from 'rxjs';

import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  public constructor(private loaderService: LoaderService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loaderService.setLoading(true, request.url);

    return next
      .handle(request)
      .pipe(finalize(() => this.loaderService.setLoading(false, request.url)));
  }
}
