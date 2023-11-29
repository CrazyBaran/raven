import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { ButtonModule, ButtonSize } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'ui-tag',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() public labelTemplate?: TemplateRef<unknown>;

  @Input() public icon = 'fa-solid fa-tag';
  @Input() public label?: string;
  @Input() public htmlClass?: string;
  @Input() public style?: Record<string, string | undefined | boolean>;
  @Input() public size: ButtonSize = 'small';

  @Input() public removable?: boolean = false;
  @Input() public clickable?: boolean = false;

  @Output() public tagClick = new EventEmitter<MouseEvent>();
  @Output() public tagRemove = new EventEmitter<void>();
}
