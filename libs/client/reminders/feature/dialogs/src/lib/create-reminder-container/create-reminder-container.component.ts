/* eslint-disable @nx/enforce-module-boundaries */
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
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
import { ACTIVE_OPPORTUNITY_SOURCE } from '@app/client/shared/util';
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
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { of, pipe, switchMap, tap } from 'rxjs';

export type createReminderState = {
  form: ReminderForm | undefined;
  organisationId: string | undefined;
  opportunityId: string | undefined;
  loadingStaticCompany: boolean;
  staticCompany:
    | { name: string; id: string; organisationId: string }
    | undefined;
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
    versionTags: ngrxStore.selectSignal(tagsQuery.selectVersionTags),
    staticOpportunity: computed(() =>
      ngrxStore.selectSignal(tagsQuery.selectTagById(store.opportunityId())),
    ),
    staticValue: computed(() => {
      const staticOpportunity = ngrxStore.selectSignal(
        opportunitiesQuery.selectOpportunityById(store.opportunityId()!),
      );

      return {
        company: store.staticCompany()!,
        opportunity: staticOpportunity()?.tag,
      };
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
              ? tagsService.getTags({ organisationId, type: 'company' }).pipe(
                  tapResponse({
                    next: (response) => {
                      const staticCompany = response.data![0]!;
                      patchState(store, {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        staticCompany: staticCompany as any,
                      });
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
            if (!store.form()) {
              return;
            }
            store.form()?.controls.tag.setValue(staticValue!);

            if (staticValue?.company?.id) {
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
          tagTypes: ['opportunity', 'people', 'version'],
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
  protected activeOpportunityFn = inject(ACTIVE_OPPORTUNITY_SOURCE);

  public ngOnInit(): void {
    this.createReminderStore.setForm(this.form);
    this.createReminderStore.setOrganisationId(this.organisationId);
    this.createReminderStore.setOpportunityId(this.opportunityId);
  }
}
