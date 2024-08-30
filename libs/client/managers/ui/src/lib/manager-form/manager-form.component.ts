/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CurrencyData, GeographyData } from '@app/client/managers/data-access';
import { OnErrorDirective } from '@app/client/shared/ui-directives';
import { TagData } from '@app/rvns-tags';
import {
  DropDownsModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  NumericTextBoxModule,
  TextAreaModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { Currency } from 'rvns-shared';

export type ManagerForm = FormGroup<{
  description: FormControl<string | null>;
  strategy: FormControl<string | null>;
  avgCheckSize: FormControl<number | null>;
  avgCheckSizeCurrency: FormControl<Currency | null>;
  aum: FormControl<number | null>;
  aumCurrency: FormControl<Currency | null>;
  geography: FormControl<Array<string> | null>;
  industryTags: FormControl<Array<TagData> | null>;
}>;

export const MAX_MANAGER_DESCRIPTION_LENGTH = 1000;

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    LabelModule,
    NumericTextBoxModule,
    TextAreaModule,
    OnErrorDirective,
    MultiSelectModule,
    DropDownsModule,
  ],
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerFormComponent {
  public readonly maxDescriptionLength = MAX_MANAGER_DESCRIPTION_LENGTH;
  public readonly geographyData = GeographyData;
  public readonly currencyData = CurrencyData;

  public form = input.required<ManagerForm>();
  public industries = input<Array<TagData>>([]);
}
