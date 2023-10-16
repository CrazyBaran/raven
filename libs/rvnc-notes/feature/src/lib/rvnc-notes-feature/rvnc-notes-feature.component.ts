import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rvnc-notes-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rvnc-notes-feature.component.html',
  styleUrls: ['./rvnc-notes-feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureComponent {}
