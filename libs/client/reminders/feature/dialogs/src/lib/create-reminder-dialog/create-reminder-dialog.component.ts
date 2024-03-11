/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe, JsonPipe } from '@angular/common';
import { RemindersActions } from '@app/client/reminders/state';
import { ReminderFormComponent } from '@app/client/reminders/ui';
import { DynamicDialogContentBase } from '@app/client/shared/shelf';
import {
  ControlInvalidPipe,
  ControlStatePipe,
} from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { TagsService } from '@app/client/tags/data-access';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { take } from 'rxjs';
import {
  CRAETE_REMINDER_FORM,
  providerReminderForm,
  REMINDER_COMPANY_SOURCE,
  REMINDER_USERS_SOURCE,
} from '../create-reminder-form.token';
import { selectCreateReminderViewModel } from './create-remidner-dialog.selectors';

@Component({
  selector: 'app-create-reminder-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    LoaderModule,
    ControlStatePipe,
    AsyncPipe,
    ControlInvalidPipe,
    ReminderFormComponent,
    JsonPipe,
  ],
  templateUrl: './create-reminder-dialog.component.html',
  styleUrls: ['./create-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm],
})
export class CreateReminderDialogComponent
  extends DynamicDialogContentBase
  implements OnInit
{
  public route = DialogUtil.queryParams.createReminder;

  protected store = inject(Store);

  protected actions$ = inject(Actions);

  protected tagsService = inject(TagsService);

  protected vm = this.store.selectSignal(selectCreateReminderViewModel);

  protected form = inject(CRAETE_REMINDER_FORM);

  protected companySourceFn = inject(REMINDER_COMPANY_SOURCE);
  protected usersSourceFn = inject(REMINDER_USERS_SOURCE);

  protected staticCompany = signal<unknown>(null);

  public ngOnInit(): void {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );

    if (this.vm().createParams.organisation) {
      this.tagsService
        .getTags({
          organisationId: this.vm().createParams.organisation!.id,
        })
        .subscribe((response) => {
          const staticCompany = {
            name: this.vm().createParams.organisation!.name,
            id: response.data![0].id,
          };
          this.staticCompany.set(staticCompany);
          this.form.controls.tag.setValue({
            company: {
              name: this.vm().createParams.organisation!.name,
              id: response.data![0].id,
            },
            opportunity: this.vm().createParams.opportunity
              ? {
                  name: this.vm().createParams.opportunity!.name!,
                  id: this.vm().createParams.opportunity!.id,
                }
              : undefined,
          });
        });

      if (this.vm().createParams.opportunity) {
        this.form.controls.tag.disable();
      }
    }
  }

  protected onDialogClose(): void {
    this.dialog.close();
  }

  protected submit(): void {
    const value = this.form.getRawValue();
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

    this.actions$
      .pipe(ofType(RemindersActions.createReminderSuccess), take(1))
      .subscribe((response) => {
        this.dialog.close();
      });
  }
}
