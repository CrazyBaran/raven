import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OnErrorDirective } from '@app/client/shared/ui-directives';
import { ControlStatePipe } from '@app/client/shared/ui-pipes';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  FormFieldModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { RxPush } from '@rx-angular/template/push';

export type ShortlistForm = FormGroup<{
  name: FormControl<string | null>;
  description: FormControl<string | null>;
}>;

export const MAX_SHORTLIST_NAME_LENGTH = 100;
export const MAX_SHORTLIST_DESCRIPTION_LENGTH = 1000;

@Component({
  selector: 'app-shortlist-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    TextAreaModule,
    LoaderModule,
    ControlStatePipe,
    RxPush,
    OnErrorDirective,
  ],
  templateUrl: './shortlist-form.component.html',
  styleUrls: ['./shortlist-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistFormComponent {
  public injector = inject(Injector);

  public form = input.required<ShortlistForm>();

  public nameControl = computed(() => this.form()?.controls.name);

  public descriptionControl = computed(() => this.form()?.controls.description);

  public maxNameLength = MAX_SHORTLIST_NAME_LENGTH;
  public maxDescriptionLength = MAX_SHORTLIST_DESCRIPTION_LENGTH;
}
