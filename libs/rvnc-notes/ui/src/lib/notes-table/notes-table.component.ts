import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NoteData } from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-notes-table',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonsModule],
  templateUrl: './notes-table.component.html',
  styleUrls: ['./notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotesTableComponent {
  @Input({ required: true }) public notes: NoteData[] = [];
}
