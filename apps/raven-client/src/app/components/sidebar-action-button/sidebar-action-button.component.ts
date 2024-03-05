import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ClickOutsideDirective } from '@app/client/shared/util';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-sidebar-action-button',
  standalone: true,
  imports: [
    NgClass,
    ButtonModule,
    PopupModule,
    TooltipModule,
    ClickOutsideDirective,
  ],
  templateUrl: './sidebar-action-button.component.html',
  styleUrls: ['./sidebar-action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SidebarActionButtonComponent {
  @Output() public newNoteClick = new EventEmitter<void>();
  @Output() public newReminderClick = new EventEmitter<void>();

  protected showPopup = signal(false);

  public onNewNoteClick(): void {
    this.newNoteClick.emit();
    this.showPopup = signal(false);
  }

  public onNewReminderClick(): void {
    this.newReminderClick.emit();
    this.showPopup = signal(false);
  }
}
