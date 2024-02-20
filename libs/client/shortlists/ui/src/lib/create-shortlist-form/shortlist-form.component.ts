import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormFieldModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

export type CreateShortlistForm = FormGroup<{
  name: FormControl<string | null>;
  description: FormControl<string | null>;
}>;

const MAX_SHORTLIST_DESCRIPTION_LENGTH = 1000;

@Component({
  selector: 'app-shortlist-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    TextAreaModule,
  ],
  templateUrl: './shortlist-form.component.html',
  styleUrls: ['./shortlist-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistFormComponent {
  public form = input.required<CreateShortlistForm>();
}
