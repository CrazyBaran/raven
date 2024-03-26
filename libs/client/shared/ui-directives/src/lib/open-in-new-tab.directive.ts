import { Directive, HostListener, input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[openInNewTab]',
  standalone: true,
})
export class OpenInNewTabDirective {
  public openInNewTab = input.required<string>();

  @HostListener('click') public onClick(): void {
    window.open(this.openInNewTab(), '_blank');
  }
}
