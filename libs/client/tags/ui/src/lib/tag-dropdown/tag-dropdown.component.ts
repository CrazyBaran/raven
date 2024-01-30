/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ClickOutsideDirective,
  ControlValueAccessor,
} from '@app/client/shared/util';
import { TagsService } from '@app/client/tags/data-access';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { isEqual } from 'lodash';
import { unique } from 'ng-packagr/lib/utils/array';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TagsButtonGroupComponent } from '../tags-button-group/tags-button-group.component';

export type DropdownTag = {
  id: string;
  name: string;
  companyId?: number | null;
  type:
    | 'company'
    | 'opportunity'
    | 'industry'
    | 'investor'
    | 'business-model'
    | 'company_root';
};

export type TagDropdownValue =
  | string
  | { organisationId: string; opportunityTagId: string };

@Component({
  selector: 'app-tag-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    DropDownsModule,
    ButtonsModule,
    TextBoxModule,
    ClickOutsideDirective,
    ReactiveFormsModule,
    TagsButtonGroupComponent,
  ],
  templateUrl: './tag-dropdown.component.html',
  styleUrls: ['./tag-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagDropdownComponent),
      multi: true,
    },
  ],
})
export class TagDropdownComponent extends ControlValueAccessor<
  TagDropdownValue[]
> {
  protected tagService = inject(TagsService);
  protected store = inject(Store);

  protected value: WritableSignal<TagDropdownValue[]> = signal([]);
  protected value$ = toObservable(this.value);

  public override writeValue(value: TagDropdownValue[]): void {
    this.value.set(value);
  }

  @Output() public openTagDialog = new EventEmitter<{
    type: string;
    search: string;
  }>();

  @Output() public tagClicked = new EventEmitter<DropdownTag>();

  @Input() public loading = false;

  @Input() public set tags(value: DropdownTag[]) {
    this.tagsSignal.set(value);
  }

  @Input() public set tagType(value: DropdownTag['type']) {
    this.tagTypeControl.setValue(value);
  }

  protected tagTypeControl = inject(NonNullableFormBuilder).control<
    DropdownTag['type']
  >('company');

  protected type = toSignal(
    this.tagTypeControl.valueChanges.pipe(startWith(this.tagTypeControl.value)),
  );

  public tagsSignal = signal([] as DropdownTag[]);

  protected filterValue = signal('');

  protected oportunityTags = computed(() =>
    this.tagsSignal().filter((item) => item.type === 'opportunity'),
  );
  protected opportunityTags$ = toObservable(this.oportunityTags);

  protected filter$ = toObservable(this.filterValue);
  protected companyTags$ = this.filter$.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((filter) =>
      this.tagService.getTags({ type: 'company', query: filter, take: 50 }),
    ),
    tap((response) => {
      this.store.dispatch(
        TagsActions.getTagsByTypesSuccess({
          data: response.data!,
          tagTypes: ['company'],
        }),
      );
    }),
    map(
      (response): DropdownTag[] =>
        response.data?.map((item) => ({
          ...item,
          type: 'company',
        })) ?? [],
    ),
  );

  protected companyTags = toSignal(this.companyTags$);
  protected hasChildren = (dataItem: object): boolean =>
    'type' in dataItem && dataItem.type === 'company_root';

  protected children = (dataItem: object): Observable<object[]> =>
    combineLatest([this.opportunityTags$, this.value$]).pipe(
      map(([opportunityTags, value]) => {
        const companyId = 'id' in dataItem ? (dataItem?.id as string) : '';
        const companyTag = {
          id: companyId,
          name: 'name' in dataItem ? dataItem?.name : '',
          label: '(No linked opportunity)',
          type: 'company',
          companyId: 'id' in dataItem ? dataItem?.id : '',
        };

        const tags = opportunityTags
          .filter(
            ({ id }) =>
              !value.some(
                (v) =>
                  typeof v !== 'string' &&
                  v.organisationId === companyId &&
                  v.opportunityTagId === id,
              ),
          )
          .map((t) => ({
            ...t,
            companyId: 'id' in dataItem ? dataItem.id : null,
          }));

        return this.value().some(
          (t) => typeof t === 'string' && t === companyId,
        )
          ? tags
          : [companyTag, ...tags];
      }),
      distinctUntilChanged(isEqual),
    );

  protected currentTypeTags = computed(() => {
    const type = this.type();

    if (type === 'company') {
      return (this.companyTags() ?? []).map((item) => ({
        ...item,
        type: 'company_root',
      }));
    }

    return this.tagsSignal().filter((item) => {
      return (
        item.type === type &&
        item.name.toLowerCase().includes(this.filterValue().toLowerCase()) &&
        !this.value().includes(item.id)
      );
    });
  });

  protected filterExpandSettings: FilterExpandSettings = {
    maxAutoExpandResults: 4,
  };

  public itemClicked(dataItem: DropdownTag): void {
    this.tagClicked.emit(dataItem);

    if (this.type() === 'company_root') {
      return;
    }

    if (dataItem.type === 'opportunity') {
      const companyId = String(dataItem.companyId ?? '');
      this.value.update((value) =>
        unique([
          ...value,
          {
            organisationId: companyId,
            opportunityTagId: dataItem.id,
          },
        ]),
      );
      this.onChange?.(this.value());
      return;
    }

    this.value.set([...this.value(), dataItem.id]);
    this.onChange?.(this.value());
  }

  public onOpenTagDialog(): void {
    this.openTagDialog.emit({
      type: this.type()!,
      search: this.filterValue()!,
    });
  }
}
