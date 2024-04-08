import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  OpportunitiesActions,
  opportunitiesQuery,
} from '@app/client/opportunities/data-access';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import { Tag } from '@app/client/tags/data-access';
import { tagsQuery } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  ItemDisabledFn,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { Observable, map, startWith, take, tap } from 'rxjs';

export const selectDealTeamAdminDialogViewModel = createSelector(
  opportunitiesQuery.selectRouteOpportunityDetails,
  tagsQuery.selectPeopleTags,
  opportunitiesQuery.selectUpdateTeam,
  (opportunity, people, { isLoading }) => {
    return {
      opportunity,
      people,
      isLoading: isLoading,
    };
  },
);

@Component({
  selector: 'app-deal-team-admin-dialog',
  standalone: true,
  imports: [
    DialogModule,
    FormFieldModule,
    MultiSelectModule,
    LabelModule,
    ReactiveFormsModule,
    TagComponent,
    DropDownListModule,
    ButtonModule,
    LoaderModule,
    UserTagDirective,
  ],
  templateUrl: './deal-team-admin-dialog.component.html',
  styleUrl: './deal-team-admin-dialog.component.scss',
})
export class DealTeamAdminDialogComponent {
  public dialogClose = output();

  public rolesData = ['Deal Lead', 'Team Member'];

  protected cdr = inject(ChangeDetectorRef);

  protected actions = inject(Actions);

  protected fb = inject(NonNullableFormBuilder);

  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectDealTeamAdminDialogViewModel);

  protected teamFormGroup = this.fb.group({
    people: [[] as Tag[]],
    roles: this.fb.array(
      [] as FormGroup<{
        user: FormControl<Tag>;
        role: FormControl<'Deal Lead' | 'Team Member'>;
      }>[],
    ),
  });

  protected teamFormValue = toSignal(
    this.teamFormGroup.valueChanges.pipe(startWith(this.teamFormGroup.value)),
  );

  protected peopleItemDisabled$: Observable<ItemDisabledFn> =
    this.teamFormGroup.valueChanges.pipe(
      startWith(this.teamFormGroup.value),
      map((value) => {
        return (itemArgs: {
          dataItem: { id: string };
          index: number;
        }): boolean => {
          const adminCount = value.roles!.filter(
            (r) => r.role === 'Deal Lead',
          ).length;

          if (adminCount > 1) {
            return false;
          }

          const isAdmin =
            value.roles!.find((r) => r.user?.id === itemArgs.dataItem.id)
              ?.role === 'Deal Lead';

          return isAdmin;
        };
      }),
    );

  protected peopleItemDisabled = toSignal(this.peopleItemDisabled$);

  protected adminCount = computed(() => {
    return this.teamFormValue()!.roles!.filter((r) => r.role === 'Deal Lead')
      .length;
  });

  public constructor() {
    this.teamFormGroup.controls.people.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const rolesArray = this.teamFormGroup.controls.roles;

        const added = value.filter(
          (v) => !rolesArray.value.find((r) => r.user?.id === v.id),
        );

        const removed = rolesArray.value.filter(
          (r) => !value.find((v) => r.user?.id === v.id),
        );

        removed.forEach((r) => {
          rolesArray.removeAt(rolesArray.value.indexOf(r));
        });

        added.forEach((r) => {
          const hasAdmin = rolesArray.controls.some(
            ({ value }) => value.role === 'Deal Lead',
          );

          rolesArray.push(
            this.fb.group({
              user: [r],
              role: [
                hasAdmin
                  ? 'Team Member'
                  : ('Deal Lead' as 'Team Member' | 'Deal Lead'),
              ],
            }),
          );
        });

        this.teamFormGroup.updateValueAndValidity();
        this.cdr.detectChanges();
      });

    this.teamFormGroup.controls.roles.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.detectChanges();
      });

    setTimeout(() => {
      const { team } = this.vm().opportunity!;

      if (!team) {
        this.teamFormGroup.setValue({
          people: [],
          roles: [],
        });
        return;
      }

      this.teamFormGroup.setValue({
        people: [
          ...team.owners.map(
            (m) => this.vm().people.find((x) => x.userId === m.actorId)!,
          ),
          ...team.members.map(
            (m) => this.vm().people.find((x) => x.userId === m.actorId)!,
          ),
        ],
        roles: [
          ...team.owners.map((m) => ({
            user: this.vm().people.find((x) => x.userId === m.actorId)!,
            role: 'Deal Lead' as 'Deal Lead' | 'Team Member',
          })),
          ...team.members.map((m) => ({
            user: this.vm().people.find((x) => x.userId === m.actorId)!,
            role: 'Team Member' as 'Deal Lead' | 'Team Member',
          })),
        ],
      });
    }, 5);
  }

  protected updateTeam(): void {
    const payload = {
      owners: this.teamFormGroup.value
        .roles!.filter((r) => r.role === 'Deal Lead')
        .map((r) => r.user!.userId!),
      members: this.teamFormGroup.value
        .roles!.filter((r) => r.role === 'Team Member')
        .map((r) => r.user!.userId!),
    };

    this.store.dispatch(
      OpportunitiesActions.updateOpportunityTeam({
        id: this.vm().opportunity!.id,
        method: this.vm().opportunity!.team?.owners.length ? 'patch' : 'post',
        payload,
      }),
    );

    this.actions
      .pipe(
        takeUntilDestroyed(),
        ofType(OpportunitiesActions.updateOpportunityTeamSuccess),
        take(1),
        tap(() => {
          this.dialogClose.emit();
        }),
      )
      .subscribe();
  }
}
