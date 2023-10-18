import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

export const scrollTabStates = ['default', 'active', 'disabled'] as const;
export type ScrollTabState = (typeof scrollTabStates)[number];

@Component({
  selector: 'app-scroll-tab',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './scroll-tab.component.html',
  styleUrls: ['./scroll-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTabComponent {
  @Input() state: ScrollTabState = 'default';
  @Input() label: string | undefined | null = null;
  @Input() showEye = true;

  @Output() eyeClick = new EventEmitter<MouseEvent>();
  @Output() labelClick = new EventEmitter<MouseEvent>();
}
