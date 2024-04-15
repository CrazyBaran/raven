import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LoaderComponent } from '@app/client/shared/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-page-template',
  standalone: true,
  imports: [CommonModule, ButtonModule, LoaderComponent],
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTemplateComponent {
  @Input() public pageName: string;
  @Input() public pageIcon: string;
  @Input() public isLoading = false;
  @Input() public loadingMessage = 'Loading...';
}
