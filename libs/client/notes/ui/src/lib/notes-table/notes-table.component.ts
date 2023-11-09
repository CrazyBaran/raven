import { Clipboard } from '@angular/cdk/clipboard';
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
import { TagComponent } from '@app/client/shared/ui';
import { TruncateElementsDirective } from '@app/client/shared/util';
import { NoteData } from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';

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
  ],
  templateUrl: './notes-table.component.html',
  styleUrls: ['./notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotesTableComponent {
  @Input({ required: true }) public notes: NoteData[] = [];

  public sort: SortDescriptor[] = [
    {
      field: 'updatedAt',
      dir: 'asc',
    },
  ];

  public constructor(
    private readonly dialogService: DialogService,
    private readonly noteFacade: NoteStoreFacade,
    private readonly clipBoard: Clipboard,
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
  }
}
