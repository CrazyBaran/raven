import { LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { KanbanFooterGroup } from '../kanban-board/kanban-board.component';

@Component({
  selector: 'app-drop-confirmation',
  standalone: true,
  imports: [
    TitleCasePipe,
    NgClass,
    DialogModule,
    ButtonModule,
    SwitchModule,
    LowerCasePipe,
  ],
  templateUrl: './drop-confirmation.component.html',
  styleUrls: ['./drop-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropConfirmationComponent {
  @Input() public footerGroup: KanbanFooterGroup | null;

  @Output() public confirmEvent = new EventEmitter<void>();

  @Output() public cancelEvent = new EventEmitter<void>();

  protected onConfirmDialog(): void {
    this.confirmEvent.emit();
  }

  protected onCancelDialog(): void {
    this.cancelEvent.emit();
  }
}
