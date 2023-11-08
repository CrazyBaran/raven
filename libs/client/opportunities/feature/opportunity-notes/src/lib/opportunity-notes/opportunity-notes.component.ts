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
import { NotesActions } from '@app/client/notes/data-access';
import {
  NoteDetailsComponent,
  NotesTableComponent,
} from '@app/client/notes/ui';
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
    NoteDetailsComponent,
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
    this.store.dispatch(NotesActions.getNotes({}));
  }

  public valueChange($event: { id: string }): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { noteType: $event.id },
      queryParamsHandling: 'merge',
    });
  }

  public handleClosePreview(): void {
    this.router.navigate([], {
      queryParams: {
        noteId: null,
      },
    });
  }
}
