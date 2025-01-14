import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NotesTableComponent } from '@app/client/notes/ui';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  ButtongroupNavigationComponent,
  DropdownNavigationComponent,
} from '@app/client/shared/ui-router';
import { TagsActions } from '@app/client/tags/state';
import { TemplateActions } from '@app/client/templates/data-access';
import { Store } from '@ngrx/store';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { selectOpportunityNotesViewModel } from './opportunity-notes.selectors';

@Component({
  selector: 'app-opportunity-notes',
  standalone: true,
  imports: [
    ButtonGroupModule,
    RxFor,
    ButtonModule,
    DropDownListModule,
    RxLet,
    RxIf,
    NotesTableComponent,
    RouterLink,
    RouterOutlet,
    NgIf,
    ButtongroupNavigationComponent,
    DropdownNavigationComponent,
  ],
  templateUrl: './opportunity-notes.component.html',
  styleUrls: ['./opportunity-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityNotesComponent implements OnInit {
  protected store = inject(Store);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected vm = this.store.selectSignal(selectOpportunityNotesViewModel);

  public ngOnInit(): void {
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());

    this.store.dispatch(
      TagsActions.getTagByOrganisationIdIfNotLoaded({
        organisationId: this.vm().organisationId!,
      }),
    );
  }

  public valueChange($event: { id: string }): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { noteType: $event.id },
      queryParamsHandling: 'merge',
    });
  }

  public handleOpenNotepad(): void {
    this.store.dispatch(
      ShelfActions.openNotepad({
        organisationId: this.vm().organisationTagId,
        opportunityId: this.vm().opportunityTagId,
        versionTagId: this.vm().versionTagId,
      }),
    );
  }
}
