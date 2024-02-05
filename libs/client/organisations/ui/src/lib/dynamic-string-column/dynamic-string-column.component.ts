import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

@Component({
  standalone: true,
  selector: 'app-dynamic-string-column',
  templateUrl: './dynamic-string-column.component.html',
  styleUrls: ['./dynamic-string-column.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicStringColumnComponent extends DynamicColumnBase<string> {}
