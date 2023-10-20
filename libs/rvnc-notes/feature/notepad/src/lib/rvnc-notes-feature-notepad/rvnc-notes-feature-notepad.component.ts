import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotepadComponent } from '@app/rvnc-notes/ui';
import { DynamicControl } from '@app/rvnc-notes/util';

@Component({
  selector: 'app-rvnc-notes-feature-notepad',
  standalone: true,
  imports: [CommonModule, NotepadComponent],
  templateUrl: './rvnc-notes-feature-notepad.component.html',
  styleUrls: ['./rvnc-notes-feature-notepad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotepadComponent implements OnInit {
  protected mockConfig: Record<string, DynamicControl> = {
    title: {
      controlType: 'input',
      label: 'Title',
      order: 1,
      value: '',
    },
    description: {
      controlType: 'richText',
      label: 'Description',
      order: 2,
      value: '',
    },
    content: {
      controlType: 'richText',
      label: 'Content',
      order: 3,
      value: '',
    },
    market: {
      controlType: 'input',
      label: 'Market/Competition',
      order: 5,
      value: '',
    },
    product: {
      controlType: 'richText',
      label: 'Product/Tech',
      order: 6,
      value: '',
    },
    team: {
      controlType: 'richText',
      label: 'Team/Founding Story',
      order: 7,
      value: '',
    },
  };

  public ngOnInit(): void {
    console.log('Ng_On_Init');
  }
}
