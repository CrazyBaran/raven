import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagComponent } from '@app/rvnc-notes/api-tags';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import { TagFilterPipe } from '@app/rvnc-notes/util';
import { TruncateElementsDirective } from '@app/rvnc-shared/util';
import { NoteData } from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
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
