/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { RavenNotificationsService } from '@app/client/shared/util-notifications';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public constructor(
    private readonly router: Router,
    private notificationService: RavenNotificationsService,
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError((error) => this.handleAuthError(error, request, next)));
  }

  private handleAuthError(
    error: HttpErrorResponse | string,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<any> {
    const parsedError = typeof error === 'string' ? JSON.parse(error) : error;

    if (
      error instanceof HttpErrorResponse &&
      error.status === 401 &&
      request.url.includes('auth/login')
    ) {
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse && error.status === 401) {
      return throwError(() => error); // TODO: handle 401 error
    }

    if (
      (error instanceof HttpErrorResponse && error.status === 403) ||
      parsedError?.statusCode === 403
    ) {
      this.handle403Error(error);
    }

    if (
      (error instanceof HttpErrorResponse && error.status === 502) ||
      parsedError?.statusCode === 502
    ) {
      return this.handle502Error(error);
    }

    return throwError(() => error);
  }

  private handle403Error(error: HttpErrorResponse | string): Observable<any> {
    this.notificationService.showErrorNotification({
      content: 'Access denied.',
    });

    // this.router.navigateByUrl('/access-denied', {
    //   skipLocationChange: true,
    // }); //TODO: handle 403 error

    return throwError(() => error);
  }

  private handle502Error(error: HttpErrorResponse | string): Observable<any> {
    this.router.navigateByUrl('/bad-gateway');

    return throwError(() => error);
  }
}
