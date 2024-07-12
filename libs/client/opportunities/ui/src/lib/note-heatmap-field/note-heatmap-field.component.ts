import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { dynamicDialogDirective } from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  HeatmapItem,
  HeatmapItemComponent,
} from '../heatmap-item/heatmap-item.component';

export interface HeatmapGroup {
  uniqId: string;
  title: string;
  noteFields: HeatmapItem[];
}

export interface NoteHeatmap {
  fields: HeatmapGroup[];
}

@Component({
  selector: 'app-note-heatmap-field',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    ButtonModule,
    HeatmapItemComponent,
    dynamicDialogDirective,
    NgClass,
  ],
  templateUrl: './note-heatmap-field.component.html',
  styleUrl: './note-heatmap-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteHeatmapFieldComponent {
  public heatmap = input.required<NoteHeatmap>();
  public printMode = input<boolean>(false);
}
