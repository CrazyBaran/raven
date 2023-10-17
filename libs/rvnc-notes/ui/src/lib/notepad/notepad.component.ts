import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotepadComponent {}
