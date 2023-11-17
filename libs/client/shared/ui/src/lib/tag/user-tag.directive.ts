import { ChangeDetectorRef, Directive, inject } from '@angular/core';
import { TagComponent } from './tag.component';

@Directive({
  selector: 'ui-tag [uiUserTag]',
  standalone: true,
})
export class UserTagDirective {
  private cd = inject(ChangeDetectorRef);

  private tagComponent = inject(TagComponent);

  public constructor() {
    this.tagComponent.icon = 'fa-solid fa-circle-user';
    this.tagComponent.removable = false;
    this.tagComponent.clickable = false;
    this.cd.markForCheck();
  }
}
