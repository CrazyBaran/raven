import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotesActions } from '@app/client/notes/data-access';
import { NotesTableComponent } from '@app/client/notes/ui';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';
import { TemplateActions } from '@app/client/templates/data-access';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectNotesTableViewModel } from './notes-table-container.selectors';

@Component({
  selector: 'app-notes-table-container',
  standalone: true,
  imports: [CommonModule, NotesTableContainerComponent, NotesTableComponent],
  templateUrl: './notes-table-container.component.html',
  styleUrls: ['./notes-table-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesTableContainerComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectNotesTableViewModel);

  public constructor() {
    this.store
      .select(selectNotesTableViewModel)
      .pipe(
        map(({ params }) => params),
        distinctUntilChangedDeep(),
        takeUntilDestroyed(),
      )
      .subscribe((params) => {
        this.store.dispatch(NotesActions.getNotes({ params }));
      });
    this.store.dispatch(NotesActions.openNotesTable());
    this.store.dispatch(TemplateActions.getTemplateIfNotLoaded());
  }
}
