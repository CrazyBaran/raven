import { DecimalPipe, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type Heat = 'average' | 'good' | 'great';

export interface HeatmapItem {
  uniqId: string;
  heat: Heat;
  title: string;
  value: string | number | null;
  unit: string;
}

export const HEATMAP_ITEM_STYLE_DICTIONARY: Record<
  Heat,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  average: {
    color: '#424242',
    backgroundColor: '#FBDC8C',
  },
  good: {
    backgroundColor: '#B3D6B7',
    color: '#424242',
  },
  great: {
    backgroundColor: 'var(--informational-success)',
    color: 'white',
  },
};

@Component({
  selector: 'app-heatmap-item',
  standalone: true,
  imports: [NgStyle, DecimalPipe],
  templateUrl: './heatmap-item.component.html',
  styleUrl: './heatmap-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatmapItemComponent {
  public item = input.required<HeatmapItem>();

  protected style = computed(
    () => HEATMAP_ITEM_STYLE_DICTIONARY[this.item().heat],
  );
}
