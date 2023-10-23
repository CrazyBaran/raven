/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
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
  id: number;
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

  public data = signal([
    { id: 2, name: 'Andrew Fuller', companyId: null, type: 'company' },
    { id: 1, name: 'Nancy Davolio', companyId: 2, type: 'company' },
    { id: 3, name: 'Janet Leverling', companyId: 2, type: 'company' },
    { id: 4, name: 'Margaret Peacock', companyId: 2, type: 'company' },
    { id: 5, name: 'Steven Buchanan', companyId: 2, type: 'company' },
    { id: 8, name: 'Laura Callahan', companyId: 2, type: 'company' },
    { id: 6, name: 'Michael Suyama', companyId: 2, type: 'company' },
    { id: 7, name: 'Robert King', companyId: 2, type: 'company' },
    { id: 9, name: 'Anne Dodsworth', companyId: null, type: 'company' },
    { id: 10, name: 'Pedro Afonso', companyId: 9, type: 'company' },
    { id: 11, name: 'Maria Anders', companyId: 9, type: 'company' },
    { id: 12, name: 'Christina Berglund', companyId: 9, type: 'company' },
    { id: 13, name: 'Hanna Moos', companyId: 9, type: 'company' },
    { id: 14, name: 'Frédérique Citeaux', companyId: 9, type: 'company' },
    { id: 15, name: 'Martín Sommer', companyId: 9, type: 'company' },
    { id: 16, name: 'Laurence Lebihan', companyId: 9, type: 'company' },
    { id: 17, name: 'Elizabeth Lincoln', type: 'industry' },
    { id: 18, name: 'Victoria Ashworth', type: 'industry' },
    { id: 19, name: 'Patricio Simpson', type: 'industry' },
    { id: 20, name: 'Francisco Chang', type: 'industry' },
    { id: 21, name: 'Yang Wang', type: 'investor' },
    { id: 22, name: 'Pedro Afonso', type: 'investor' },
    { id: 23, name: 'Elizabeth Brown', type: 'investor' },
    { id: 24, name: 'Sven Ottlieb', type: 'investor' },
    { id: 25, name: 'Janine Labrune', type: 'businessModel' },
    { id: 26, name: 'Ann Devon', type: 'businessModel' },
    { id: 27, name: 'Roland Mendel', type: 'businessModel' },
    { id: 28, name: 'Aria Cruz', type: 'businessModel' },
    { id: 29, name: 'Diego Roel', type: 'businessModel' },
    { id: 30, name: 'Martine Rancé', type: 'businessModel' },
    { id: 31, name: 'Maria Larsson', type: 'businessModel' },
  ]);

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
      return (
        item.name.toLowerCase().includes(filter) &&
        item.type.toLowerCase().includes(type)
      );
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
