import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rvnc-notes-feature-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rvnc-notes-feature-notes-list.component.html',
  styleUrls: ['./rvnc-notes-feature-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotesListComponent {}
