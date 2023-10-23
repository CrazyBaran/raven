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
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ControlInjectorPipe, DynamicControl } from '@app/rvnc-notes/util';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { debounceTime, map, startWith } from 'rxjs';
import { DynamicControlResolver } from '../dynamic-control-resolver.service';

const TAG_FORM_DICTIOANRY: Record<string, DynamicControl[]> = {
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
      placeholder: '...',
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
      placeholder: '...',
      validators: {
        required: true,
      },
    },
    {
      type: 'text',
      name: 'Investor Domain (Required)',
      order: 1,
      id: 'domain',
      placeholder: '...',
      validators: {
        required: true,
      },
    },
  ],
  businessModel: [
    {
      type: 'text',
      name: 'Business Model Name (Required)',
      order: 1,
      id: 'name',
      placeholder: '...',
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
    ButtonGroupModule,
    ButtonModule,
    DialogModule,
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

  protected type = signal('company');

  protected formDictioanry = TAG_FORM_DICTIOANRY;

  protected dynamicData = signal(this.formDictioanry['company']);

  protected tagForm = new UntypedFormGroup({});

  protected value$ = this.tagForm.valueChanges.pipe(
    startWith(this.tagForm.value),
  );
  protected val = toSignal(this.value$);

  protected name = toSignal(
    this.tagForm.valueChanges.pipe(
      debounceTime(50),
      map((value) => value[Object.keys(value)[0]]),
    ),
  );

  protected buttons = [
    { text: 'Company', id: 'company', selected: true },
    {
      text: 'Industry',
      id: 'industry',
      selected: false,
    },
    { text: 'Investor', id: 'investor', selected: false },
    { text: 'Business Model', id: 'businessModel', selected: false },
  ];

  public constructor(public override dialog: DialogRef) {
    super(dialog);
  }

  protected get controlKeys(): string[] {
    return Object.keys(this.tagForm?.controls ?? {});
  }

  @Input() public set inputData(value: { type: string; search: string }) {
    if (value.type && value.search) {
      this.formDictioanry = {
        ...TAG_FORM_DICTIOANRY,
        [value.type]: TAG_FORM_DICTIOANRY[value.type].map((item, index) => ({
          ...item,
          value: index === 0 ? value.search : item.value,
        })),
      };
    }
    this.type.set(value.type);
    this.dynamicData.set(this.formDictioanry[value.type]);
    this.buttons = this.buttons.map((btn) => ({
      ...btn,
      selected: btn.id === value.type,
    }));
  }

  protected trackByFn = (index: number, item: DynamicControl): string =>
    item.id;

  protected selectedChange(id: string): void {
    this.dynamicData.set(this.formDictioanry[id]);
  }

  protected submit(): void {
    if (this.tagForm.valid) {
      this.dialog.close({
        submitted: { ...this.tagForm.value, type: this.type() },
      });
    }
  }
}
