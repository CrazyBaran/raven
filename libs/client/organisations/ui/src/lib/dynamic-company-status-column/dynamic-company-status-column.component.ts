import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

export type CompanyStatusColumn = {
  name: string;
  color: string;
  queryParam: { [key: string]: string };
};

@Component({
  standalone: true,
  selector: 'app-dynamic-company-status-column',
  templateUrl: './dynamic-company-status-column.component.html',
  styleUrls: ['./dynamic-company-status-column.component.scss'],
  imports: [
    IsEllipsisActiveDirective,
    TitleCasePipe,
    ButtonModule,
    RouterLink,
    RxUnpatch,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCompanyStatusColumnComponent extends DynamicColumnBase<CompanyStatusColumn> {}
