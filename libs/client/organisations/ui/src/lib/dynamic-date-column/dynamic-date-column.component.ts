import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

export type DateColumn = {
  value: string;
  format?: string;
};

@Component({
  standalone: true,
  selector: 'app-dynamic-string-column',
  templateUrl: './dynamic-date-column.component.html',
  styleUrls: ['./dynamic-date-column.component.scss'],
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDateColumnComponent extends DynamicColumnBase<DateColumn> {
  public get format(): string {
    return this.field.format ?? 'dd/MM/yyyy';
  }
}
