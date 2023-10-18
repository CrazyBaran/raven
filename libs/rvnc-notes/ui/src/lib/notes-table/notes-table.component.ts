import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NoteData } from '@app/rvns-notes/data-access';

@Component({
  selector: 'app-notes-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-table.component.html',
  styleUrls: ['./notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesTableComponent {
  @Input({ required: true }) public notes: NoteData[] = [];
}
