import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PipelinesActions } from '@app/client/organisations/api-pipelines';
import { TagsActions } from '@app/client/organisations/api-tags';
import {
  OrganisationsActions,
  OrganisationsUrlActions,
} from '@app/client/organisations/state';
import {
  FilterTilesComponent,
  OrganisationsTableComponent,
  OrganisationsTableViewComponent,
} from '@app/client/organisations/ui';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
  TextBoxNavigationComponent,
} from '@app/client/shared/ui-router';
import {
  PageTemplateComponent,
  QuickFiltersTemplateComponent,
} from '@app/client/shared/ui-templates';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TagsService } from '@app/client/tags/data-access';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import {
  selectOrganisationsTableParams,
  selectOrganisationsTableViewModel,
} from './organisations-table-v2.selectors';

@Component({
  selector: 'app-client-organisations-feature-organisations-table',
  standalone: true,
  imports: [
    PageTemplateComponent,
    TextBoxNavigationComponent,
    QuickFiltersTemplateComponent,
    ButtongroupNavigationComponent,
    DropdownNavigationComponent,
    OrganisationsTableViewComponent,
    OrganisationsTableViewComponent,
    DatePipe,
    OrganisationsTableComponent,
    ButtonModule,
    KeyValuePipe,
    FilterTilesComponent,
    RouterLink,
    DialogModule,
    FormFieldModule,
    LabelModule,
    ComboBoxModule,
    TextBoxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './organisations-table-v2.component.html',
  styleUrls: ['./organisations-table-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableV2Component {
  public organisationFormGroup = inject(FormBuilder).group({
    name: [''],
    domain: [''],
  });

  public loading = signal(false);
  public filter = signal('');
  public showCreateDialog = signal(false);

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

  protected vm = this.store.selectSignal(selectOrganisationsTableViewModel);

  public constructor(
    private store: Store,
    private tagService: TagsService,
  ) {
    this.store.dispatch(PipelinesActions.getPipelines());
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['opportunity', 'people'],
      }),
    );
    this.store.dispatch(OrganisationsActions.getDataWarehouseLastUpdated());

    this.store
      .select(selectOrganisationsTableParams)
      .pipe(
        takeUntilDestroyed(),
        distinctUntilChangedDeep({ ignoreOrder: true }),
      )
      .subscribe((params) => {
        this.store.dispatch(
          OrganisationsUrlActions.queryParamsChanged({ params }),
        );
      });
  }

  public openOrganisationDialog(): void {
    this.store.dispatch(ShelfActions.openOpportunityForm({}));
  }

  public save(): void {
    this.showCreateDialog.set(false);
  }

  public closeDialog(): void {
    this.showCreateDialog.set(false);
  }

  public onFilterChange($event: string): void {
    this.filter.set($event);
  }
}
