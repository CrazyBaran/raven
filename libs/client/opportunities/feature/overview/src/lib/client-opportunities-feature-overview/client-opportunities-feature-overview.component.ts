import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { trigger } from '@angular/animations';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import {
  fadeIn,
  KendoDynamicPagingDirective,
  LoaderComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { Tag } from '@app/client/tags/data-access';
import { TagsActions } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  DropDownListModule,
  ItemDisabledFn,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  LoaderModule,
  SkeletonModule,
} from '@progress/kendo-angular-indicators';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import { map, Observable, startWith, tap } from 'rxjs';
import { selectOpportunityOverviewViewModel } from './client-opportunities-feature-overview.selectors';

@Component({
  selector: 'app-client-opportunities-feature-overview',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    ButtonModule,
    RxFor,
    GridModule,
    TagComponent,
    UserTagDirective,
    RouterLink,
    KendoDynamicPagingDirective,
    LoaderComponent,
    SkeletonModule,
    TimesPipe,
    DialogModule,
    MultiSelectModule,
    LabelModule,
    FormFieldModule,
    ReactiveFormsModule,
    DropDownListModule,
    LoaderModule,
  ],
  templateUrl: './client-opportunities-feature-overview.component.html',
  styleUrls: ['./client-opportunities-feature-overview.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureOverviewComponent {
  public rolesData = ['admin', 'user'];

  protected store = inject(Store);

  protected actions = inject(Actions);

  protected fb = inject(NonNullableFormBuilder);

  protected cdr = inject(ChangeDetectorRef);

  protected vm = this.store.selectSignal(selectOpportunityOverviewViewModel);

  protected showEditTeam = signal(false);

  protected teamFormGroup = this.fb.group({
    people: [[] as Tag[]],
    roles: this.fb.array(
      [] as FormGroup<{
        user: FormControl<Tag>;
        role: FormControl<'admin' | 'user'>;
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
            (r) => r.role === 'admin',
          ).length;

          if (adminCount > 1) {
            return false;
          }

          const isAdmin =
            value.roles!.find((r) => r.user?.id === itemArgs.dataItem.id)
              ?.role === 'admin';

          return isAdmin;
        };
      }),
    );

  protected adminCount = computed(() => {
    return this.teamFormValue()!.roles!.filter((r) => r.role === 'admin')
      .length;
  });

  public constructor() {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['people'] }),
    );

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
            ({ value }) => value.role === 'admin',
          );

          rolesArray.push(
            this.fb.group({
              user: [r],
              role: [hasAdmin ? 'user' : ('admin' as 'user' | 'admin')],
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

    this.actions
      .pipe(
        takeUntilDestroyed(),
        ofType(OpportunitiesActions.updateOpportunityTeamSuccess),
        tap(() => {
          this.showEditTeam.set(false);
        }),
      )
      .subscribe();
  }

  protected updateTeam(): void {
    const payload = {
      owners: this.teamFormGroup.value
        .roles!.filter((r) => r.role === 'admin')
        .map((r) => r.user!.userId!),
      members: this.teamFormGroup.value
        .roles!.filter((r) => r.role === 'user')
        .map((r) => r.user!.userId!),
    };

    this.store.dispatch(
      OpportunitiesActions.updateOpportunityTeam({
        id: this.vm().opportunity!.id,
        method: this.vm().opportunity!.team?.owners.length ? 'patch' : 'post',
        payload,
      }),
    );
  }

  protected openTeamEdit(): void {
    this.showEditTeam.set(true);
    setTimeout(() => {
      const { team } = this.vm().opportunity!;

      if (!team) {
        this.teamFormGroup.setValue({
          people: [],
          roles: [],
        });
        this.showEditTeam.set(true);
        return;
      }

      this.teamFormGroup.setValue({
        people: [
          ...team.owners.map(
            (m) => this.vm().users.find((x) => x.userId === m.actorId)!,
          ),
          ...team.members.map(
            (m) => this.vm().users.find((x) => x.userId === m.actorId)!,
          ),
        ],
        roles: [
          ...team.owners.map((m) => ({
            user: this.vm().users.find((x) => x.userId === m.actorId)!,
            role: 'admin' as 'admin' | 'user',
          })),
          ...team.members.map((m) => ({
            user: this.vm().users.find((x) => x.userId === m.actorId)!,
            role: 'user' as 'admin' | 'user',
          })),
        ],
      });
    }, 5);
  }
}
