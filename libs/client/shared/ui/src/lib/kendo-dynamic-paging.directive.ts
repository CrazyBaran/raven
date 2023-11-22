import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  signal,
} from '@angular/core';
import { NgxResizeObserverService } from '@app/client/shared/ui-directives';
import { GridComponent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[uiKendoDynamicPaging]',
  standalone: true,
  exportAs: 'uiKendoDynamicPaging',
  providers: [NgxResizeObserverService],
})
export class KendoDynamicPagingDirective implements AfterViewInit, OnDestroy {
  @Input({ alias: 'uiKendoDynamicPaging' }) public itemSize = 56;

  public elementRef = inject(ElementRef);
  public cdr = inject(ChangeDetectorRef);
  public appRef = inject(ApplicationRef);
  public observableService = inject(NgxResizeObserverService);

  public grid = inject(GridComponent);

  public size = signal(5);

  public get listElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector('kendo-grid-list');
  }

  public ngAfterViewInit(): void {
    this.observableService.observe(
      this.listElement,
      (entries) => {
        const pageSize = entries.contentRect.height / this.itemSize;
        this.grid.pageSize = Math.floor(pageSize);

        // this.cdr.markForCheck();
        // this.cdr.detectChanges();
        // this.appRef.tick();

        this.size.set(Math.floor(pageSize));
      },
      this.listElement.style.boxSizing,
    );
  }

  public ngOnDestroy(): void {
    this.observableService.unobserve(this.listElement);
  }
}
