/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactStrengthData } from '@app/client/managers/data-access';
import { OnErrorDirective } from '@app/client/shared/ui-directives';
import {
  DropDownsModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import {
  FormFieldModule,
  NumericTextBoxModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { FundManagerContactStrength } from 'rvns-shared';

export type ContactForm = FormGroup<{
  name: FormControl<string | null>;
  position: FormControl<string | null>;
  relationStrength: FormControl<FundManagerContactStrength | null>;
  email: FormControl<string | null>;
  linkedin: FormControl<string | null>;
}>;

export const MAX_CONTACT_NAME_LENGTH = 512;

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    LabelModule,
    NumericTextBoxModule,
    TextBoxModule,
    TextAreaModule,
    OnErrorDirective,
    MultiSelectModule,
    DropDownsModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  public readonly maxNameLength = MAX_CONTACT_NAME_LENGTH;
  public readonly contactStrengthData = ContactStrengthData;

  public form = input.required<ContactForm>();
}
