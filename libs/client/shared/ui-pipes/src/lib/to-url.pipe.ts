import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUrl',
  standalone: true,
})
export class ToUrlPipe implements PipeTransform {
  public transform(
    routerLinkDirective: // | RouterLink
    | string[]
      | {
          routeParams?: string[];
          queryParams?: Record<string, string>;
          currentUrl?: boolean;
        },
  ): string {
    if (Array.isArray(routerLinkDirective)) {
      return `${window.location.origin + '/' + routerLinkDirective.join('/')}`;
    }

    if (routerLinkDirective.currentUrl) return window.location.href;

    const params = new URLSearchParams();
    for (const key in routerLinkDirective.queryParams) {
      params.set(key, routerLinkDirective.queryParams[key]);
    }

    if (routerLinkDirective.routeParams) {
      return `${
        window.location.origin +
        '/' +
        routerLinkDirective.routeParams.join('/') +
        '?' +
        params.toString()
      }`;
    }

    return `${window.location.origin + '?' + params.toString()}`;
  }
}
