/* eslint-disable @nx/enforce-module-boundaries */
import { LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CreateReminderContainerComponent } from '@app/client/reminders/feature/dialogs';
import { RemindersActions } from '@app/client/reminders/state';
import {
  CRAETE_REMINDER_FORM,
  providerReminderForm,
} from '@app/client/reminders/utils';
import { ControlInvalidPipe } from '@app/client/shared/ui-pipes';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { RxPush } from '@rx-angular/template/push';
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
    ReactiveFormsModule,
    ControlInvalidPipe,
    CreateReminderContainerComponent,
    RxPush,
  ],
  templateUrl: './drop-confirmation.component.html',
  styleUrls: ['./drop-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm],
})
export class DropConfirmationComponent {
  @Input() public footerGroup: KanbanFooterGroup | null;

  @Input() public opportunityId?: string;
  @Input() public organisationId?: string;

  @Output() public confirmEvent = new EventEmitter<{
    removeCompanyFromShortlist: boolean;
  }>();

  @Output() public cancelEvent = new EventEmitter<void>();

  public store = inject(Store);

  protected removeCompanyFromShortlist = new FormControl(false);

  protected setReminderForm = new FormControl(false);
  protected reminderForm = inject(CRAETE_REMINDER_FORM);

  protected onConfirmDialog(): void {
    this.confirmEvent.emit({
      removeCompanyFromShortlist: this.removeCompanyFromShortlist.value!,
    });

    //todo: refactor this to reuse logic
    if (this.setReminderForm.value) {
      const value = this.reminderForm.getRawValue();
      this.store.dispatch(
        RemindersActions.createReminder({
          data: {
            name: value.title!,
            description: value.description!,
            dueDate: value.dueDate!,
            assignees: value.assignees!,
            tag: value.tag
              ? {
                  companyId: value.tag.company.id,
                  opportunityId: value.tag.opportunity?.id ?? '',
                }
              : undefined,
          },
        }),
      );
    }
  }

  protected onCancelDialog(): void {
    this.cancelEvent.emit();
  }
}
