import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Directive({
  selector: '[uiKendoUrlPaging]',
  standalone: true,
  exportAs: 'uiKendoUrlPaging',
})
export class KendoUrlPagingDirective implements AfterViewInit {
  @Input() public queryParamsHandling: 'merge' | 'preserve' = 'merge';

  public constructor(
    private grid: GridComponent,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngAfterViewInit(): void {
    this.grid.pageChange.subscribe((event) => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...event },
        queryParamsHandling: this.queryParamsHandling,
      });
    });
  }
}

@Directive({
  selector: '[uiKendoUrlSorting]',
  standalone: true,
  exportAs: 'uiKendoUrlSorting',
})
export class KendoUrlSortingDirective implements AfterViewInit {
  @Input() public queryParamsHandling: 'merge' | 'preserve' = 'merge';

  public constructor(
    private grid: GridComponent,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngAfterViewInit(): void {
    this.grid.sortChange.subscribe((event) => {
      const { field, dir } = event?.[0] || {
        field: null,
        dir: null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { field, dir },
        queryParamsHandling: this.queryParamsHandling,
      });
    });
  }
}
