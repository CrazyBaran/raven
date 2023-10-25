import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@app/rvnc-shared/util';
import { TagType } from '@app/rvns-tags';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { RxFor } from '@rx-angular/template/for';

export type SelectTagButton = {
  text: string;
  type: TagType;
};

export const TAG_BUTTONS: SelectTagButton[] = [
  { text: 'Company', type: 'company' },
  {
    text: 'Industry',
    type: 'industry',
  },
  { text: 'Investor', type: 'investor' },
  { text: 'Business Model', type: 'business-model' },
];

@Component({
  selector: 'app-tags-button-group',
  standalone: true,
  imports: [CommonModule, ButtonGroupModule, ButtonModule, RxFor],
  templateUrl: './tags-button-group.component.html',
  styleUrls: ['./tags-button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsButtonGroupComponent),
      multi: true,
    },
  ],
})
export class TagsButtonGroupComponent extends ControlValueAccessor<TagType> {
  @Output() public tagSelected = new EventEmitter<TagType>();

  protected value: WritableSignal<TagType> = signal('company');

  protected buttonsSignal: WritableSignal<SelectTagButton[]> =
    signal(TAG_BUTTONS);

  @Input() public set buttons(value: SelectTagButton[]) {
    this.buttonsSignal.set(value);
  }

  public override writeValue(value: TagType): void {
    this.value.set(value);
  }

  protected selectedChange(type: TagType): void {
    this.value.set(type);
    this.tagSelected.emit(type);
    this.onChange?.(type);
  }
}
