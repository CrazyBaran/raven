/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  inject,
  input,
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
  getOpportunityName,
} from '@app/client/shared/util';

import { ACTIVE_OPPORTUNITY_SOURCE } from '@app/client/shared/util';
import { TagData } from '@app/rvns-tags';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import * as _ from 'lodash';
import { isEqual } from 'lodash';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { TagsButtonGroupComponent } from '../tags-button-group/tags-button-group.component';

export type DropdownTag = {
  id: string;
  name: string;
  companyId?: string;
  organisationId?: string;
  type:
    | 'company'
    | 'opportunity'
    | 'industry'
    | 'investor'
    | 'business-model'
    | 'version'
    | 'company_root';
  domain?: string;
};

export type OpportunityComplexTag = {
  organisationId: string;
  opportunityTagId: string;
};
export type VersionComplexTag = {
  organisationId: string;
  versionTagId: string;
};

export type TagDropdownValue =
  | string
  | OpportunityComplexTag
  | VersionComplexTag;

export const isSimpleTagDropdownValue = (
  item: TagDropdownValue,
): item is string => {
  return typeof item === 'string';
};

export const isOpportunityComplexTag = (
  item: TagDropdownValue,
): item is OpportunityComplexTag => {
  return !isSimpleTagDropdownValue(item) && 'opportunityTagId' in item;
};

export const isVersionComplexTag = (
  item: TagDropdownValue,
): item is VersionComplexTag => {
  return !isSimpleTagDropdownValue(item) && 'versionTagId' in item;
};

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
  protected store = inject(Store);

  protected value: WritableSignal<TagDropdownValue[]> = signal([]);
  protected value$ = toObservable(this.value);

  public override writeValue(value: TagDropdownValue[]): void {
    this.value.set(value);
  }
  protected activeOpportunityFn = inject(ACTIVE_OPPORTUNITY_SOURCE);

  @Output() public openTagDialog = new EventEmitter<{
    type: string;
    search: string;
  }>();

  @Output() public tagClicked = new EventEmitter<DropdownTag>();

  public companySourceFn$ =
    input.required<(filter: string) => Observable<TagData[]>>();

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

  public activeIconColor = '#b6d8a8';

  protected filterValue = signal('');

  protected oportunityTags = computed(() =>
    this.tagsSignal().filter((item) => item.type === 'opportunity'),
  );

  protected versionTags = computed(() =>
    this.tagsSignal().filter((item) => item.type === 'version'),
  );

  protected opportunityTags$ = toObservable(this.oportunityTags);
  protected versionTags$ = toObservable(this.versionTags);

  protected filter$ = toObservable(this.filterValue);
  protected companyTags$ = this.filter$.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((filter) => this.companySourceFn$()(filter)),
    map(
      (tags): DropdownTag[] =>
        tags.map((item) => ({
          ...item,
          type: 'company',
        })) ?? [],
    ),
  );

  protected companyTags = toSignal(this.companyTags$);
  protected hasChildren = (dataItem: object): boolean =>
    'type' in dataItem && dataItem.type === 'company_root';

  protected children = ((dataItem: DropdownTag): Observable<object[]> =>
    combineLatest([
      this.activeOpportunityFn(dataItem.organisationId!),
      this.opportunityTags$,
      this.value$,
      this.versionTags$,
    ]).pipe(
      map(
        ([orgActiveOpportunity, allOpportunityTags, value, allVersionTags]) => {
          const companyId = dataItem.id;

          const opportunityTags = allOpportunityTags
            .filter(
              ({ id }) =>
                !value.some(
                  (v) =>
                    isOpportunityComplexTag(v) &&
                    v.organisationId === companyId &&
                    v.opportunityTagId === id,
                ),
            )
            .map((t) => ({
              ...t,
              companyId: companyId,
            }));

          const versionTags = allVersionTags
            .filter(
              (versionTag) =>
                !value.some(
                  (v) =>
                    isVersionComplexTag(v) && v.versionTagId === versionTag.id,
                ) &&
                ('organisationId' in versionTag &&
                  versionTag.organisationId) ===
                  ('organisationId' in dataItem && dataItem['organisationId']),
            )
            .map((t) => ({
              ...t,
              companyId: companyId,
            }));

          const orderedTags = [
            ..._.sortBy(opportunityTags, 'order'),
            ..._.orderBy(versionTags, (x) => x.name),
          ];
          let index = 0;
          let activeOppIndex = -1;
          let opportunitiesList = [...orderedTags].map((o) => {
            let isActive = false;
            if (o.id === orgActiveOpportunity?.tag?.id) {
              activeOppIndex = index;
              isActive = true;
            }
            index++;

            return {
              ...o,
              name: isActive
                ? getOpportunityName(orgActiveOpportunity)
                : o.name,
              active: isActive,
            };
          });
          if (activeOppIndex > -1) {
            opportunitiesList = [
              opportunitiesList[activeOppIndex],
              ...opportunitiesList.filter(
                (item) => item.id !== orgActiveOpportunity?.tag?.id,
              ),
            ];
          }

          return opportunitiesList;
        },
      ),
      distinctUntilChanged(isEqual),
    )) as (node: object) => Observable<object[]>;

  protected currentTypeTags = computed(() => {
    const type = this.type();

    if (type === 'company') {
      return (this.companyTags() ?? []).map((item) => ({
        ...item,
        name: `${item?.name} (${item?.domain})`,
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

    const value: TagDropdownValue =
      dataItem.type === 'opportunity'
        ? {
            organisationId: dataItem.companyId!,
            opportunityTagId: dataItem.id,
          }
        : dataItem.type === 'version'
          ? {
              organisationId: dataItem.companyId!,
              versionTagId: dataItem.id,
            }
          : dataItem.id;

    this.value.set([...this.value(), value]);
    this.onChange?.(this.value());
  }

  public onOpenTagDialog(): void {
    this.openTagDialog.emit({
      type: this.type()!,
      search: this.filterValue()!,
    });
  }
}
