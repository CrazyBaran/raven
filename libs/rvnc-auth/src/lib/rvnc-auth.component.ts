import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-rvnc',
  templateUrl: './rvnc-auth.component.html',
})
export class RvncAuthComponent {
  public prepareRoute(outlet: RouterOutlet): boolean {
    return outlet?.activatedRouteData?.['animation'];
  }
}
