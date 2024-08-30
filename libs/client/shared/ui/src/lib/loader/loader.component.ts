import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'ui-loader',
  standalone: true,
  imports: [CommonModule, IndicatorsModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input() public loaderInfo?: string = 'Loading...';
  @Input() public disableInfo?: boolean;
  @Input() public fixed = false;
}
