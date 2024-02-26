import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

export type CompanyShortlistIndicatorColumn = {
  shortlists: {
    name: string;
    id: string;
  }[];
};

@Component({
  standalone: true,
  selector: 'app-dynamic-company-column',
  templateUrl: './dynamic-shortlist-indicator-column.component.html',
  styleUrls: ['./dynamic-shortlist-indicator-column.component.scss'],
  imports: [RouterLink, IsEllipsisActiveDirective, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicShortlistIndicatorColumnComponent extends DynamicColumnBase<CompanyShortlistIndicatorColumn> {}
