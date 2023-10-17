import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rvnc-notes-feature-notepad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rvnc-notes-feature-notepad.component.html',
  styleUrls: ['./rvnc-notes-feature-notepad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotepadComponent {}
