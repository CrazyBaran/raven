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
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { startWith } from 'rxjs';
import { TagsButtonGroupComponent } from '../tags-button-group/tags-button-group.component';

export type DropdownTag = {
  id: string;
  name: string;
  companyId?: number | null;
  type: TagType;
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

  public override writeValue(value: string[]): void {
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

  @Input() public set tagType(value: TagType) {
    this.tagTypeControl.setValue(value);
  }

  protected tagTypeControl = inject(NonNullableFormBuilder).control<TagType>(
    'company',
  );

  protected type = toSignal(
    this.tagTypeControl.valueChanges.pipe(startWith(this.tagTypeControl.value)),
  );

  public tagsSignal = signal([] as DropdownTag[]);

  protected filterValue = signal('');

  protected currentTypeTags = computed(() => {
    const type = this.type()?.toLowerCase();

    return this.tagsSignal().filter(
      (item) =>
        !this.value().includes(item.id) &&
        (type === 'company'
          ? ['company', 'opportunity'].includes(item.type)
          : item.type === type),
    );
  });

  protected filterExpandSettings: FilterExpandSettings = {
    maxAutoExpandResults: 4,
  };

  public itemClicked(dataItem: DropdownTag): void {
    if (this.type() === 'company' && !dataItem.companyId) {
      return;
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
