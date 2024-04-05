/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MultiSelectSourceFnDirective,
  OnControlStateDirective,
  OnErrorDirective,
} from '@app/client/shared/ui-directives';
import { ControlStatePipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import {
  DropDownTreesModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  FormFieldModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import * as _ from 'lodash';
import { Observable, of, take } from 'rxjs';

export type CompanyOpportunityTreeItem = {
  company: {
    id: string;
    name: string;
  };
  opportunity?: {
    id: string;
    name: string;
  };
  id: string;
};

export type ReminderForm = FormGroup<{
  description: FormControl<string | null>;
  title: FormControl<string | null>;
  tag: FormControl<Omit<CompanyOpportunityTreeItem, 'id'> | null>;
  assignees: FormControl<string[] | null>;
  dueDate: FormControl<Date | null>;
}>;

export const MAX_SHORTLIST_NAME_LENGTH = 100;
export const MAX_SHORTLIST_DESCRIPTION_LENGTH = 1000;

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    LabelModule,
    TextBoxModule,
    TextAreaModule,
    LoaderModule,
    ControlStatePipe,
    OnErrorDirective,
    OnControlStateDirective,
    DropDownTreesModule,
    MultiSelectModule,
    DatePickerModule,
    ButtonModule,
    MultiSelectSourceFnDirective,
  ],
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderFormComponent {
  public maxTitleLength = MAX_SHORTLIST_NAME_LENGTH;
  public maxDescriptionLength = MAX_SHORTLIST_DESCRIPTION_LENGTH;

  public injector = inject(Injector);

  public form = input.required<ReminderForm>();
  public loggedUserTag = input.required<{ id: string; name: string }>();
  public opportunities = input.required<{ id: string; name: string }[]>();
  public usersSource =
    input.required<
      (text: string) => Observable<{ name: string; id: string }[]>
    >();
  public companySource =
    input.required<(id: string) => Observable<CompanyOpportunityTreeItem[]>>();

  public staticCompany = input<{ id: string; name: string }>();
  public versionTags =
    input.required<{ id: string; name: string; organisationId: string }[]>();

  public tagSource = computed(() => {
    return this.staticCompany()
      ? () => of([{ id: '', company: this.staticCompany() }])
      : this.companySource();
  });

  public today: Date = new Date(new Date().setHours(0, 0, 0, 0));
  public get assignButtonDisabled(): boolean {
    return !!this.form().controls.assignees.value?.includes(
      this.loggedUserTag()?.id,
    );
  }

  public hasChildrenFn: (node: object) => boolean = (node) =>
    !('opportunity' in node);

  public fetchChildrenFn: (node: object) => Observable<object[]> = (node) => {
    const treeNode = node as CompanyOpportunityTreeItem;
    const versionTags = this.versionTags().filter(
      ({ organisationId }) =>
        organisationId ===
        ('organisationId' in treeNode.company &&
          treeNode.company.organisationId),
    );
    return of(
      [...this.opportunities(), ...versionTags].map((o) => {
        return {
          opportunity: o,
          company: treeNode.company,
          id: `${treeNode.company.id}-${o.id}`,
        };
      }),
    ).pipe(take(1));
  };

  public onAssignToMe(): void {
    this.form().controls.assignees.setValue(
      _.uniq([
        this.loggedUserTag().id,
        ...(this.form().controls.assignees.value ?? []),
      ]),
    );
  }
}
