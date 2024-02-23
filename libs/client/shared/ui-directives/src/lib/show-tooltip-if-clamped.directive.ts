import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[showTooltipIfClamped]',
  standalone: true,
})
export class ShowTooltipIfClampedDirective implements AfterViewInit {
  protected elementRef = inject(ElementRef);

  @Input()
  public set showTooltipIfClamped(value: string | undefined) {
    setTimeout(() => {
      this.setTitleIfClamped();
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.setTitleIfClamped();
    }, 500);
  }

  private setTitleIfClamped(): void {
    const element = this.elementRef.nativeElement;
    if (
      element.offsetWidth < element.scrollWidth ||
      element.offsetHeight < element.scrollHeight
    ) {
      element.title = element.innerHTML;
    } else {
      element.title = '';
    }
  }
}
