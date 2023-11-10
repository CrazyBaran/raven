import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-page-template',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTemplateComponent {
  @Input() public pageName: string;
  @Input() public pageIcon: string;
}
