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
import { ClickOutsideDirective } from '@app/rvnc-notes/util';
import { ControlValueAccessor } from '@app/rvnc-shared/util';
import { TagType } from '@app/rvns-tags';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import * as _ from 'lodash';
import { isEqual } from 'lodash';
import { unique } from 'ng-packagr/lib/utils/array';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { TagsButtonGroupComponent } from '../tags-button-group/tags-button-group.component';

export type DropdownTag = {
  id: string;
  name: string;
  companyId?: number | null;
  type: TagType | 'company_root';
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
export class TagDropdownComponent extends ControlValueAccessor<string[]> {
  protected value: WritableSignal<string[]> = signal([]);
  protected linkedOpportunities: WritableSignal<Record<string, string[]>> =
    signal({});

  protected linkedOpportunities$ = toObservable(this.linkedOpportunities);

  public override writeValue(value: string[]): void {
    this.value.set(value);
    this.linkedOpportunities.update((dict) =>
      _.mapValues(dict, (value, key) =>
        _.uniq(value.filter((v) => this.value().includes(v))),
      ),
    );
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

  protected companyTags = computed(() =>
    this.tagsSignal().filter((item) => item.type === 'company'),
  );

  protected value$ = toObservable(this.value);

  protected hasChildren = (dataItem: object): boolean =>
    'type' in dataItem && dataItem.type === 'company_root';

  protected children = (dataItem: object): Observable<object[]> =>
    combineLatest([
      this.opportunityTags$,
      this.value$,
      this.linkedOpportunities$,
    ]).pipe(
      map(([opportunityTags, value, linkedOpportunities]) => {
        const companyId = 'id' in dataItem ? (dataItem?.id as string) : '';
        const companyTag = {
          id: companyId,
          name: 'name' in dataItem ? dataItem?.name : '',
          label: '(No linked opportunity)',
          type: 'company',
          companyId: 'id' in dataItem ? dataItem?.id : '',
        };
        const tags = opportunityTags
          .map((t) => ({
            ...t,
            companyId: 'id' in dataItem ? dataItem.id : null,
          }))
          .filter(({ id }) => !linkedOpportunities[companyId]?.includes(id)); //TODO: Remove this filter when opportunities will have relations per company

        return this.value().includes(companyId) ? tags : [companyTag, ...tags];
      }),
      distinctUntilChanged(isEqual),
    );

  protected currentTypeTags = computed(() => {
    const type = this.type();

    if (type === 'company') {
      return this.companyTags()
        .filter((item) =>
          item.name.toLowerCase().includes(this.filterValue().toLowerCase()),
        )
        .slice(0, 15)
        .map((item) => ({
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
    if (this.type() === 'company_root') {
      return;
    }

    if (dataItem.type === 'opportunity') {
      const compandyId = dataItem?.companyId ?? '';
      this.linkedOpportunities.update((dict) => ({
        ...dict,
        [compandyId]: unique([...(dict[compandyId] ?? []), dataItem.id]),
      }));

      console.log(this.linkedOpportunities());
    }

    this.tagClicked.emit(dataItem);
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
