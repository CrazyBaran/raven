/* eslint-disable @typescript-eslint/member-ordering */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[isEllipsisActive]',
  standalone: true,
})
export class IsEllipsisActiveDirective implements AfterViewInit {
  protected elementRef = inject(ElementRef);

  protected _isEllipsisActive = true;

  @Input()
  public set isEllipsisActive(value: boolean) {
    this._isEllipsisActive = value;
  }

  @HostBinding('class') public get hostClass(): Record<string, boolean> {
    return {
      'whitespace-nowrap': this._isEllipsisActive,
      'text-ellipsis': this._isEllipsisActive,
      'overflow-hidden': this._isEllipsisActive,
    };
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.innerHTML;
      }
    }, 500);
  }
}
