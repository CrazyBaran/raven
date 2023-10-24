import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-notepad-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notepad-template.component.html',
  styleUrls: ['./notepad-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotepadTemplateComponent {
  @Input() public hideTabs = false;
}
