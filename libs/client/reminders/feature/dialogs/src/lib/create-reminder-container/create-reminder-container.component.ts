/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { AsyncPipe, JsonPipe } from '@angular/common';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  CompanyOpportunityTreeItem,
  ReminderForm,
  ReminderFormComponent,
} from '@app/client/reminders/ui';
import {
  providerReminderForm,
  REMINDER_COMPANY_SOURCE,
  REMINDER_USERS_SOURCE,
} from '@app/client/reminders/utils';
import {
  ControlInvalidPipe,
  ControlStatePipe,
} from '@app/client/shared/ui-pipes';
import { TagsService } from '@app/client/tags/data-access';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { of, pipe, switchMap, tap } from 'rxjs';

export type createReminderState = {
  form: ReminderForm | undefined;
  organisationId: string | undefined;
  opportunityId: string | undefined;
  loadingStaticCompany: boolean;
  staticCompany: { name: string; id: string } | undefined;
};

export const createReminderStore = signalStore(
  withState<createReminderState>({
    form: undefined,
    organisationId: undefined,
    opportunityId: undefined,
    loadingStaticCompany: false,
    staticCompany: undefined,
  }),
  withComputed((store, ngrxStore = inject(Store)) => ({
    currentUser: computed(() => {
      const user = ngrxStore.selectSignal(tagsQuery.selectCurrentUserTag);

      return user()
        ? {
            id: user()!.userId!,
            name: user()!.name,
          }
        : undefined;
    }),
    opportunityTags: ngrxStore.selectSignal(tagsQuery.selectOpportunityTags),
    staticOpportunity: computed(() =>
      ngrxStore.selectSignal(tagsQuery.selectTagById(store.opportunityId())),
    ),
    staticValue: computed(() => {
      const staticOpportunity = ngrxStore.selectSignal(
        opportunitiesQuery.selectOpportunityById(store.opportunityId()!),
      );

      return staticOpportunity()?.tag?.id
        ? {
            company: store.staticCompany()!,
            opportunity: staticOpportunity()!.tag!,
          }
        : undefined;
    }),
  })),
  withMethods((store, tagsService = inject(TagsService)) => {
    return {
      setForm: rxMethod<ReminderForm>(
        pipe(tap((form) => patchState(store, { form }))),
      ),
      setOrganisationId: rxMethod<string | undefined>(
        pipe(tap((organisationId) => patchState(store, { organisationId }))),
      ),
      setOpportunityId: rxMethod<string | undefined>(
        pipe(tap((opportunityId) => patchState(store, { opportunityId }))),
      ),
      loadStaticCompany: rxMethod<string | undefined>(
        pipe(
          tap(() => patchState(store, { loadingStaticCompany: true })),
          switchMap((organisationId) =>
            organisationId
              ? tagsService.getTags({ organisationId }).pipe(
                  tapResponse({
                    next: (response) => {
                      const staticCompany = {
                        name: response.data![0].name,
                        id: response.data![0].id,
                      };
                      patchState(store, { staticCompany });
                    },
                    error: console.error,
                    finalize: () =>
                      patchState(store, { loadingStaticCompany: false }),
                  }),
                )
              : of(true).pipe(
                  tap(() =>
                    patchState(store, {
                      loadingStaticCompany: false,
                      staticCompany: undefined,
                    }),
                  ),
                ),
          ),
        ),
      ),
      setStaticValue: rxMethod<
        Omit<CompanyOpportunityTreeItem, 'id'> | undefined
      >(
        pipe(
          tap((staticValue) => {
            if (store.form() && staticValue) {
              store.form()?.controls.tag.setValue(staticValue);
              store.form()?.controls.tag.disable();
            }
          }),
        ),
      ),
    };
  }),
  withHooks((store, ngrxStore = inject(Store)) => ({
    onInit: (): void => {
      ngrxStore.dispatch(
        TagsActions.getTagsByTypesIfNotLoaded({
          tagTypes: ['opportunity', 'people'],
        }),
      );
      const { organisationId, staticValue } = store;
      store.loadStaticCompany(organisationId);
      store.setStaticValue(staticValue);
    },
  })),
);

@Component({
  selector: 'app-create-reminder-container',
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
  templateUrl: './create-reminder-container.component.html',
  styleUrls: ['./create-reminder-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [providerReminderForm, createReminderStore],
})
export class CreateReminderContainerComponent implements OnInit {
  public form = input.required<ReminderForm>();
  public organisationId = input<string>();
  public opportunityId = input<string>();

  public createReminderStore = inject(createReminderStore);

  protected companySourceFn = inject(REMINDER_COMPANY_SOURCE);
  protected usersSourceFn = inject(REMINDER_USERS_SOURCE);

  public ngOnInit(): void {
    this.createReminderStore.setForm(this.form);
    this.createReminderStore.setOrganisationId(this.organisationId);
    this.createReminderStore.setOpportunityId(this.opportunityId);
  }
}
