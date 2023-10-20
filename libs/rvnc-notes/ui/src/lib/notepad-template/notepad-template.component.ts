import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlInjectorPipe } from '@app/rvnc-notes/util';
import { ScrollTabComponent } from '../scroll-tab/scroll-tab.component';

@Component({
  selector: 'app-notepad-template',
  standalone: true,
  imports: [CommonModule, ControlInjectorPipe, FormsModule, ScrollTabComponent],
  templateUrl: './notepad-template.component.html',
  styleUrls: ['./notepad-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotepadTemplateComponent {
  @Input() public hideTabs = false;
}
