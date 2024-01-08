/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor notes table

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteStoreFacade, NotesActions } from '@app/client/notes/data-access';
import { TagFilterPipe } from '@app/client/notes/util';
import {
  ClipboardDirective,
  KendoDynamicPagingDirective,
  KendoUrlPagingDirective,
  KendoUrlSortingDirective,
  LoaderComponent,
  TagComponent,
  TagTypeColorPipe,
  UserTagDirective,
} from '@app/client/shared/ui';
import { TruncateElementsDirective } from '@app/client/shared/util';
import { NoteData } from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';

import { TagItem, TagsContainerComponent } from '@app/client/shared/ui';
import {
  IsEllipsisActiveDirective,
  TableViewBaseComponent,
} from '@app/client/shared/ui-directives';
import { Store } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';
import { NoteTypeBadgeComponent } from '../note-type-badge/note-type-badge.component';

export type NoteTableRow = Omit<NoteData, 'tags'> & {
  peopleTags: TagItem[];
  tags: TagItem[];
  deleteButtonSettings?: {
    disabled?: boolean;
    tooltip?: string;
  };
};

@Component({
  selector: 'app-notes-table',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonsModule,
    RouterLink,
    TagFilterPipe,
    TruncateElementsDirective,
    TagComponent,
    TooltipModule,
    KendoDynamicPagingDirective,
    ClipboardDirective,
    KendoUrlPagingDirective,
    KendoUrlSortingDirective,
    SkeletonModule,
    LoaderComponent,
    NoteTypeBadgeComponent,
    UserTagDirective,
    TagTypeColorPipe,
    TagsContainerComponent,
    IsEllipsisActiveDirective,
  ],
  templateUrl: './notes-table.component.html',
  styleUrls: ['./notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotesTableComponent extends TableViewBaseComponent<NoteTableRow> {
  private dialogService = inject(DialogService);
  private noteFacade = inject(NoteStoreFacade);
  private store = inject(Store);

  //todo: refactor to use url dynamic dialogs
  public handleDeleteNote(note: NoteData): void {
    const dialogRef = this.dialogService.open({
      width: 350,
      content: DeleteNoteComponent,
    });

    dialogRef.result.subscribe((result) => {
      if ('submit' in result) {
        this.noteFacade.deleteNote(note.id);
      }
    });
  }

  public getNoteUrl(noteId: string): string {
    return `${window.location.href}?note-details=${noteId}`;
  }

  public handleSyncNote(newSyncId: string, id: string): void {
    this.store.dispatch(NotesActions.refreshNote({ newSyncId, noteId: id }));
  }
}
