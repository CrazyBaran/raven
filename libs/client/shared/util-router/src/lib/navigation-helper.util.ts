import { Navigation } from '@angular/router';

export function isNavigatingAway(
  currentNavigation: Navigation | null,
  route: string,
): boolean {
  return (
    !!currentNavigation &&
    !currentNavigation.extras?.relativeTo &&
    currentNavigation?.extractedUrl.toString() !== route
  );
}
