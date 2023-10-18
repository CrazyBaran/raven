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
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() labelTemplate?: TemplateRef<any>;

  @Input() icon?: string;
  @Input() label?: string;
  @Input() htmlClass?: string;

  @Output() tagClick = new EventEmitter<MouseEvent>();
  @Output() tagRemove = new EventEmitter<void>();
}
