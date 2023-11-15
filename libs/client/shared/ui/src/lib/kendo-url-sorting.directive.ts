import { AfterViewInit, Directive, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@progress/kendo-angular-grid';

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
