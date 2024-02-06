import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TagsActions } from '@app/client/organisations/api-tags';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { TagsService } from '@app/client/tags/data-access';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { DomainValidators } from './domainValidators';

@Component({
  selector: 'app-create-organisation-dialog',
  standalone: true,
  imports: [
    DialogModule,
    InputsModule,
    LabelModule,
    ComboBoxModule,
    KeyValuePipe,
    ErrorMessagePipe,
    LoaderModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './create-organisation-dialog.component.html',
  styleUrls: ['./create-organisation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrganisationDialogComponent {
  @Output() public closeDialog = new EventEmitter<void>();

  public showCreateDialog = input.required<boolean>();

  public organisationFormGroup = inject(FormBuilder).group({
    name: ['', Validators.required],
    domain: [
      '',
      [Validators.required, DomainValidators.validDomain],
      [
        DomainValidators.createDomainExistsValidator(
          inject(OrganisationsService),
        ),
      ],
    ],
  });

  public loading = signal(false);

  public filter = signal('');

  public companies = toSignal(
    toObservable(this.filter).pipe(
      distinctUntilChanged(),
      debounceTime(500),
      tap(() => this.loading.set(true)),
      switchMap((name) =>
        this.tagService
          .getTags({ type: 'company', query: name!, take: 100 })
          .pipe(map((x) => x.data?.map((y) => y.name) || [])),
      ),
      tap(() => this.loading.set(false)),
    ),
  );

  public isDomainPending = toSignal(
    this.domainControl.statusChanges.pipe(
      startWith(this.domainControl.status),
      map((status) => status === 'PENDING'),
    ),
  );

  public domainErrors = toSignal(
    this.domainControl.statusChanges.pipe(
      startWith(this.domainControl.status),
      map((status) => this.domainControl.errors),
    ),
  );

  public constructor(
    private store: Store,
    private tagService: TagsService,
    private actions$: Actions,
  ) {}

  public get domainControl(): FormControl<string | null> {
    return this.organisationFormGroup.controls.domain;
  }

  public save(): void {
    this.store.dispatch(
      TagsActions.createTag({
        data: {
          type: 'company',
          name: this.organisationFormGroup.value.name!,
          domain: this.organisationFormGroup.value.domain!,
        },
      }),
    );
    this.actions$
      .pipe(ofType(TagsActions.createTagSuccess), take(1))
      .subscribe(() => {
        this.onCloseDialog();
      });
  }

  public onCloseDialog(): void {
    this.closeDialog.emit();
  }

  public onFilterChange($event: string): void {
    this.filter.set($event);
  }
}
