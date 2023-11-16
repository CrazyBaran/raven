import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

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

  @Input() public icon?: string;
  @Input() public label?: string;
  @Input() public htmlClass?: string;

  @Input() public removable?: boolean = true;
  @Input() public clickable?: boolean = true;

  @Output() public tagClick = new EventEmitter<MouseEvent>();
  @Output() public tagRemove = new EventEmitter<void>();
}
