import { HeatmapThresholdData } from '@app/rvns-templates';

export class HeatmapFieldUtils {
  private readonly colours;

  public constructor(colors: string[] = ['#00FF00', '#FFFF00', '#FF0000']) {
    this.colours = colors;
  }

  public getColourForField(config: HeatmapThresholdData, value: number) {
    const { thresholds } = config;

    const sortedThresholds = [...thresholds].sort((a, b) => a - b);

    for (let i = 0; i < sortedThresholds.length; i++) {
      if (value <= sortedThresholds[i]) {
        return this.getColourForIndex(i);
      }
    }

    return this.getColourForIndex(sortedThresholds.length);
  }

  private getColourForIndex(index: number): string {
    return this.colours[index];
  }
}
