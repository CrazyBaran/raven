import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

export type CompanyColumn = {
  id: string;
  name: string;
  domains: string[];
};

@Component({
  standalone: true,
  selector: 'app-dynamic-company-column',
  templateUrl: './dynamic-company-column.component.html',
  styleUrls: ['./dynamic-company-column.component.scss'],
  imports: [RouterLink, IsEllipsisActiveDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCompanyColumnComponent extends DynamicColumnBase<CompanyColumn> {}
