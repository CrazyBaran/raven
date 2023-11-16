import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  signal,
} from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[uiKendoDynamicPaging]',
  standalone: true,
  exportAs: 'uiKendoDynamicPaging',
})
export class KendoDynamicPagingDirective implements AfterViewInit {
  @Input() public headerHeight = 36;

  @Input() public footerHeight = 46.7;

  @Input({ alias: 'uiKendoDynamicPaging' }) public itemSize = 56;

  public elementRef = inject(ElementRef);

  public grid = inject(GridComponent);

  public size = signal(5);

  public ngAfterViewInit(): void {
    const pageSize =
      (this.elementRef.nativeElement.offsetHeight -
        this.headerHeight -
        this.footerHeight) /
      this.itemSize;

    this.size.set(Math.floor(pageSize));
  }
}
