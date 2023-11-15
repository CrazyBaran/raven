import { AfterViewInit, Directive, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent } from '@progress/kendo-angular-grid';

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
