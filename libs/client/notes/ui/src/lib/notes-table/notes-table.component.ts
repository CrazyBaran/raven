/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor notes table

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { TagFilterPipe } from '@app/client/notes/util';
import {
  KendoDynamicPagingDirective,
  TagComponent,
} from '@app/client/shared/ui';
import { TruncateElementsDirective } from '@app/client/shared/util';
import { NoteData } from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';

import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { Store } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';

export type NoteTableRow = NoteData & {
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
  ],
  templateUrl: './notes-table.component.html',
  styleUrls: ['./notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotesTableComponent {
  @Input({ required: true }) public notes: NoteTableRow[] = [];
  @Input() public isLoading = false;

  public sort: SortDescriptor[] = [
    {
      field: 'updatedAt',
      dir: 'desc',
    },
  ];

  public constructor(
    private readonly dialogService: DialogService,
    private readonly noteFacade: NoteStoreFacade,
    private readonly clipBoard: Clipboard,
    private readonly store: Store,
  ) {}

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

  public handleCopyLink(noteId: string): void {
    this.clipBoard.copy(`${window.location.href}?noteId=${noteId}`);
    this.store.dispatch(
      NotificationsActions.showSuccessNotification({
        content: 'Link copied to clipboard.',
      }),
    );
  }
}
