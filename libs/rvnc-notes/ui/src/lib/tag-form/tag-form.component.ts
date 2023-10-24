import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';

import {
  ControlInjectorPipe,
  DynamicControl,
  DynamicControlResolver,
} from '@app/rvnc-shared/dynamic-form';
import { TagType } from '@app/rvns-tags';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { debounceTime, map, startWith } from 'rxjs';
import { TagsButtonGroupComponent } from '../tags-button-group/tags-button-group.component';

const TAG_FORM_DICTIOANRY: Partial<Record<TagType, DynamicControl[]>> = {
  company: [
    {
      type: 'text',
      name: 'Company Name (Required)',
      value: '',
      order: 1,
      id: 'name',
      placeholder: 'Company Name',
      validators: {
        required: true,
      },
    },
    {
      type: 'text',
      name: 'Company Domain (Required)',
      order: 1,
      value: '',
      id: 'domain',
      placeholder: 'Company Domain',
      validators: {
        required: true,
      },
    },
  ],
  industry: [
    {
      type: 'text',
      name: 'Industry Name (Required)',
      order: 1,
      id: 'name',
      placeholder: 'Industry Name',
      validators: {
        required: true,
      },
    },
  ],
  investor: [
    {
      type: 'text',
      name: 'Investor Name (Required)',
      order: 1,
      id: 'name',
      placeholder: 'Investor Name',
      validators: {
        required: true,
      },
    },
    {
      type: 'text',
      name: 'Investor Domain (Required)',
      order: 1,
      id: 'domain',
      placeholder: 'Investor Domain',
      validators: {
        required: true,
      },
    },
  ],
  'business-model': [
    {
      type: 'text',
      name: 'Business Model Name (Required)',
      order: 1,
      id: 'name',
      placeholder: 'Business Model Name',
      validators: {
        required: true,
      },
    },
  ],
};

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    CommonModule,
    ControlInjectorPipe,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    TagsButtonGroupComponent,
  ],
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFormComponent
  extends DialogContentBase
  implements AfterViewInit
{
  protected controlResolver = inject(DynamicControlResolver);

  protected tagTypeControl = inject(NonNullableFormBuilder).control<TagType>(
    'company',
  );

  protected type = toSignal(
    this.tagTypeControl.valueChanges.pipe(startWith(this.tagTypeControl.value)),
  );

  protected formDictionary = TAG_FORM_DICTIOANRY;

  protected dynamicData = signal(this.formDictionary['company']);

  protected tagForm = new UntypedFormGroup({});

  protected name = toSignal(
    this.tagForm.valueChanges.pipe(
      debounceTime(50),
      map((value) => value[Object.keys(value)[0]]),
    ),
  );

  public constructor(public override dialog: DialogRef) {
    super(dialog);
  }

  @Input() public set inputData(value: { type: TagType; search: string }) {
    if (value.type && value.search) {
      this.formDictionary = {
        ...TAG_FORM_DICTIOANRY,
        [value.type]: TAG_FORM_DICTIOANRY[value.type]?.map((item, index) => ({
          ...item,
          value: index === 0 ? value.search : item.value,
        })),
      };
    }
    this.tagTypeControl.setValue(value.type);
    this.dynamicData.set(this.formDictionary[value.type]);
  }

  protected trackByFn = (index: number, item: DynamicControl): string =>
    item.id;

  protected selectedChange(id: TagType): void {
    this.dynamicData.set(this.formDictionary[id]);
  }

  protected submit(): void {
    if (this.tagForm.valid) {
      this.dialog.close({
        submitted: { ...this.tagForm.value, type: this.type() },
      });
    }
  }
}
