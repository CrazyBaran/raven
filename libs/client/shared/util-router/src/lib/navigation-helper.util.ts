import { Navigation } from '@angular/router';

export function isNavigatingAway(
  currentNavigation: Navigation | null,
  route: string,
): boolean {
  return (
    !!currentNavigation &&
    currentNavigation?.extractedUrl.toString().split('?')[0] !== route
  );
}
