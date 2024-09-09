import { KeyValuePipe } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagePipe } from '@app/client/shared/dynamic-form-util';
import { MultiSelectSourceFnDirective } from '@app/client/shared/ui-directives';
import { ControlErrorsPipe, OrderByPipe } from '@app/client/shared/ui-pipes';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import {
  ComboBoxModule,
  DropDownListModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { FilterMenuModule } from '@progress/kendo-angular-grid';
import {
  FormFieldModule,
  TextAreaModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { RxPush } from '@rx-angular/template/push';
import { Observable, of } from 'rxjs';
import { DealTeamPickerComponent } from '../deal-team-picker/deal-team-picker.component';

export type OpportunityForm = FormGroup<{
  organisationId: FormControl<string | null>;
  opportunityTagId: FormControl<string | null>;
  name: FormControl<string | null>;
  roundSize: FormControl<string | null>;
  valuation: FormControl<string | null>;
  proposedInvestment: FormControl<string | null>;
  positioning: FormControl<string | null>;
  timing: FormControl<string | null>;
  underNda: FormControl<string | null>;
  ndaTerminationDate: FormControl<string | null>;
  team: FormControl<{
    owners: string[];
    members: string[];
  } | null>;
  description: FormControl<string | null | undefined>;
  coInvestors: FormControl<string | null | undefined>;
  capitalRaiseHistory: FormControl<string | null | undefined>;
}>;

export const OPPORTUNITY_NAME_MAX_LENGTH = 50;

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    FormFieldModule,
    LabelModule,
    ComboBoxModule,
    ReactiveFormsModule,
    DropDownListModule,
    FilterMenuModule,
    DateInputModule,
    DealTeamPickerComponent,
    MultiSelectModule,
    MultiSelectSourceFnDirective,
    ControlErrorsPipe,
    ErrorMessagePipe,
    RxPush,
    OrderByPipe,
    TextAreaModule,
    KeyValuePipe,
  ],
  templateUrl: './opportunity-form.component.html',
  styleUrl: './opportunity-form.component.scss',
})
export class OpportunityFormComponent {
  public readonly nameMaxLength = OPPORTUNITY_NAME_MAX_LENGTH;

  public opportunityForm = input.required<OpportunityForm>();

  public staticOrganisation = input<{ name?: string; id?: string }>();

  public companiesDataSource = input<
    (text: string) => Observable<{ name: string; id: string }[]>
  >(() => of([]));

  public isLoadingOpportunityTags = input<boolean>();
  public opportunityTags =
    input<{ name: string; id: string; userId?: string }[]>();

  public peopleTags = input<{ name: string; id: string; userId?: string }[]>();

  protected defaultFundingRound = {
    id: null,
    name: 'Choose from list',
  };

  protected organisationPlaceholder = computed(() => {
    return this.staticOrganisation()?.name ?? 'Select company';
  });

  protected readonly ndaDropdown = {
    data: [
      {
        name: 'Yes (Open)',
        id: 'Yes (Open)',
      },
      {
        name: 'Yes (Closed)',
        id: 'Yes (Closed)',
      },
      {
        name: 'No',
        id: 'No',
      },
    ],
    default: {
      name: 'Choose from list',
      id: null,
    },
  };

  public constructor() {
    effect(() => {
      if (this.staticOrganisation() && this.opportunityForm()) {
        this.opportunityForm().controls.organisationId.setValue(
          this.staticOrganisation()!.id!,
          { emitEvent: false },
        );
        this.opportunityForm().controls.organisationId.disable();
      }
    });
  }
}
