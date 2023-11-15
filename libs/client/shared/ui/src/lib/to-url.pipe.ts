import { Pipe, PipeTransform } from '@angular/core';
import { RouterLink } from '@angular/router';

@Pipe({
  name: 'toUrl',
  standalone: true,
})
export class ToUrlPipe implements PipeTransform {
  public transform(routerLinkDirective: RouterLink | string[]): string {
    if (Array.isArray(routerLinkDirective)) {
      return `${window.location.origin + routerLinkDirective.join('/')}`;
    }

    if (!routerLinkDirective.urlTree)
      throw new Error('RouterLinkDirective does not have a urlTree');

    return `${window.location.origin + routerLinkDirective.urlTree.toString()}`;
  }
}
