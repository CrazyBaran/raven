/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { ClickOutsideDirective } from './click-outside.directive';

export type DropdownTag = {
  id: string;
  name: string;
  companyId?: number | null;
  type: string;
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
  ],
  templateUrl: './tag-dropdown.component.html',
  styleUrls: ['./tag-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDropdownComponent {
  @Output() public openTagDialog = new EventEmitter<{
    type: string;
    search: string;
  }>();

  @Output() public tagClicked = new EventEmitter<DropdownTag>();

  @Input() public loading = false;

  @Input() public set tags(value: DropdownTag[]) {
    this.data.set(value);
  }

  public data = signal([] as DropdownTag[]);

  protected type = signal('company');

  protected buttons = [
    { text: 'Company', id: 'company' },
    {
      text: 'Industry',
      id: 'industry',
    },
    { text: 'Investor', id: 'investor' },
    { text: 'Business Model', id: 'bussinesModel' },
  ];

  protected selectedButtons = computed(() =>
    this.buttons.map((b) => ({
      ...b,
      selected: b.id === this.type(),
    })),
  );

  protected filterValue = signal('');

  protected textForm = new FormControl('');

  protected filter = toSignal(
    this.textForm.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      startWith(this.textForm.value),
    ),
  );

  protected filteredData = computed(() => {
    const filter = this.filter()?.toLowerCase() || '';
    const type = this.type().toLowerCase();
    return this.data().filter((item) => {
      return item.name.toLowerCase() === filter && type === 'company'
        ? item.type.toLowerCase() === type ||
            item.type.toLowerCase() === 'opportunity'
        : item.type.toLowerCase() === type;
    });
  });

  protected filterExpandSettings: FilterExpandSettings = {
    maxAutoExpandResults: 4,
  };

  public selectedChange(id: string): void {
    this.type.set(id);
  }

  public itemClicked(dataItem: DropdownTag): void {
    if (this.type() === 'company' && !dataItem.companyId) {
      return;
    }
    this.tagClicked.emit(dataItem);

    this.data.update((data) => data.filter((item) => item.id !== dataItem.id));
  }

  public onOpenTagDialog(): void {
    this.openTagDialog.emit({
      type: this.type(),
      search: this.filterValue()!,
    });
  }
}
