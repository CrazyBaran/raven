/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validator,
} from '@angular/forms';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import { ControlValueAccessor } from '@app/client/shared/util';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import {
  DropDownListModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { map, startWith } from 'rxjs';
export type Role = 'Deal Lead' | 'Team Member';

export type DealTeamPickerValue = {
  owners: string[];
  members: string[];
};

@Component({
  selector: 'app-deal-team-picker',
  standalone: true,
  imports: [
    FormFieldModule,
    LabelModule,
    MultiSelectModule,
    DropDownListModule,
    TagComponent,
    ReactiveFormsModule,
    UserTagDirective,
  ],
  templateUrl: './deal-team-picker.component.html',
  styleUrl: './deal-team-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DealTeamPickerComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DealTeamPickerComponent,
    },
  ],
})
export class DealTeamPickerComponent
  extends ControlValueAccessor<DealTeamPickerValue>
  implements Validator
{
  public people =
    input.required<{ name: string; id: string; userId?: string }[]>();

  public rolesData: Role[] = ['Deal Lead', 'Team Member'];

  public fb = inject(NonNullableFormBuilder);

  public teamFormGroup = this.fb.group({
    people: [[] as { name: string; id: string; userId?: string }[]],
    roles: this.fb.array(
      [] as FormGroup<{
        user: FormControl<{ name: string; id: string; userId?: string }>;
        role: FormControl<Role>;
      }>[],
    ),
  });

  public teamFormRawValue$ = this.teamFormGroup.valueChanges.pipe(
    map(() => this.teamFormGroup.getRawValue()),
  );

  public value$ = this.teamFormRawValue$.pipe(
    map(
      (value): DealTeamPickerValue => ({
        owners: value.roles
          .filter((r) => r.role === 'Deal Lead')
          .map((r) => r.user.userId!),
        members: value.roles
          .filter((r) => r.role === 'Team Member')
          .map((r) => r.user.userId!),
      }),
    ),
  );

  public rolesControl = this.teamFormGroup.controls.roles;

  public rolesValue = toSignal(
    this.rolesControl.valueChanges.pipe(
      startWith(this.rolesControl.getRawValue()),
      map(() => this.rolesControl.getRawValue()),
    ),
  );

  public adminCount = computed(() => {
    return this.rolesValue()?.filter((r) => r.role === 'Deal Lead').length ?? 0;
  });

  public invalidRoles = computed(() => {
    return !!(this.rolesValue()?.length && this.adminCount() === 0);
  });

  protected cdr = inject(ChangeDetectorRef);

  public constructor() {
    super();

    this.value$
      .pipe(takeUntilDestroyed(), distinctUntilChangedDeep())
      .subscribe((value) => {
        if (value.members.length || value.owners.length) {
          this.onChange?.(value);
        } else {
          this.onChange?.(null);
        }
      });
  }

  public writeValue(value: DealTeamPickerValue): void {
    this.teamFormGroup.patchValue(this._mapValueToFormValue(value), {
      onlySelf: true,
    });
    this._syncDropdownWithRolesList(value);
  }

  public validate(control: AbstractControl) {
    if (this.invalidRoles()) {
      return { invalidRoles: true };
    }

    return null;
  }

  public addPeopleToTeam() {
    this._syncDropdownWithRolesList();
  }

  private _mapValueToFormValue(value: DealTeamPickerValue) {
    return {
      people: [
        ...value.owners.map((m) => this.people().find((x) => x.userId === m)!),
        ...value.members.map((m) => this.people().find((x) => x.userId === m)!),
      ],
      roles: [
        ...value.owners.map((m) => ({
          user: this.people().find((x) => x.userId === m)!,
          role: 'Deal Lead' as const,
        })),
        ...value.members.map((m) => ({
          user: this.people().find((x) => x.userId === m)!,
          role: 'Team Member' as const,
        })),
      ],
    };
  }

  private _syncDropdownWithRolesList(
    roles: DealTeamPickerValue = { members: [], owners: [] },
  ): void {
    const value = this.teamFormGroup.controls.people.getRawValue();
    const rolesArray = this.teamFormGroup.controls.roles;
    const rolesArrayValue = rolesArray.getRawValue();

    const added = value.filter(
      (v) => !rolesArrayValue.find((r) => r.user?.id === v.id),
    );

    const removed = rolesArrayValue.filter(
      (r) => !value.find((v) => r.user?.id === v.id),
    );

    removed.forEach((r) => {
      rolesArray.removeAt(
        rolesArray.getRawValue().findIndex((el) => r.user.id === el.user.id),
      );
    });

    added.forEach((r) => {
      const hasAdmin = rolesArray.controls.some(
        ({ value }) => value.role === 'Deal Lead',
      );
      const isLead = roles.owners?.find((owner) => r.userId === owner);

      rolesArray.push(
        this.fb.group({
          user: [r],
          role: [
            hasAdmin && !isLead
              ? 'Team Member'
              : ('Deal Lead' as 'Team Member' | 'Deal Lead'),
          ],
        }),
      );
    });

    this.teamFormGroup.updateValueAndValidity();
    this.cdr.detectChanges();
  }
}
