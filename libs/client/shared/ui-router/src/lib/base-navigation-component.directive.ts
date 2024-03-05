import { Directive, inject, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Directive()
export class BaseNavigationComponent {
  protected ngZone = inject(NgZone);

  protected activatedRoute = inject(ActivatedRoute);

  private router = inject(Router);

  protected navigateWithZone(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: any[],
    extras?: NavigationExtras | undefined,
  ): void {
    this.ngZone.run(() => {
      this.router.navigate(commands, extras);
    });
  }
}
