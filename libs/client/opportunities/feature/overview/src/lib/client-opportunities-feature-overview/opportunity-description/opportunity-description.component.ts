import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NoteFieldComponent,
  StatusIndicatorComponent,
} from '@app/client/opportunities/ui';
import { RichTextComponent } from '@app/client/shared/dynamic-form-util';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { opportunityDescriptionStore } from './opportunity-description.store';

@Component({
  selector: 'app-opportunity-description',
  standalone: true,
  imports: [
    NoteFieldComponent,
    ReactiveFormsModule,
    RichTextComponent,
    StatusIndicatorComponent,
    TilelayoutItemComponent,
    TextAreaModule,
  ],
  templateUrl: './opportunity-description.component.html',
  styleUrl: './opportunity-description.component.scss',
  providers: [opportunityDescriptionStore],
  encapsulation: ViewEncapsulation.None,
})
export class OpportunityDescriptionComponent implements OnInit {
  public store = inject(opportunityDescriptionStore);

  public opportunityId = input.required<string>();
  public description = input<string | null>();
  public canEdit = input<boolean>(false);

  protected opportunityDescriptionControl = new FormControl('', {
    updateOn: 'blur',
  });

  public constructor() {
    this.store.setOpportunityId(this.opportunityId);
    const value$ = this.opportunityDescriptionControl.valueChanges;
    this.store.updateOpportunityDescription(value$);

    effect(() => {
      this.description() &&
        this.opportunityDescriptionControl.setValue(this.description()!, {
          emitEvent: false,
        });
    });
  }

  public ngOnInit(): void {
    this.opportunityDescriptionControl.setValue(this.description()!, {
      emitEvent: false,
    });
  }
}
