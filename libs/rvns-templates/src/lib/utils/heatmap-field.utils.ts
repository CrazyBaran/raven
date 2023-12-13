import { HeatmapThresholdData } from '@app/rvns-templates';

export class HeatmapFieldUtils {
  private readonly colours;

  public constructor(colors: string[] = ['#00FF00', '#FFFF00', '#FF0000']) {
    this.colours = colors;
  }

  public getColourForField(config: HeatmapThresholdData, value: number) {
    const { thresholds } = config;

    if (thresholds.length <= 1) {
      throw new Error(
        'Configuration is not correct - thresholds should have at least 2 values',
      );
    }

    const direction = this.getDirection(thresholds);

    if (direction === null) {
      throw new Error(
        'Configuration is not correct - thresholds should be sorted in ascending or descending order',
      );
    }

    if (direction === 'ASC') {
      for (let i = 0; i < thresholds.length; i++) {
        if (value <= thresholds[i]) {
          return this.getColourForIndex(i);
        }
      }
      return this.getColourForIndex(thresholds.length);
    }
    if (direction === 'DESC') {
      for (let i = 0; i < thresholds.length; i++) {
        if (value >= thresholds[i]) {
          return this.getColourForIndex(i);
        }
      }
      return this.getColourForIndex(thresholds.length);
    }
  }

  private getColourForIndex(index: number): string {
    return this.colours[index];
  }

  private getDirection(arr: number[]): 'ASC' | 'DESC' | null {
    const n = arr.length;

    let ascending = true;
    let descending = true;

    for (let i = 1; i < n; i++) {
      if (arr[i] < arr[i - 1]) {
        ascending = false;
      }
      if (arr[i] > arr[i - 1]) {
        descending = false;
      }
    }

    if (ascending) {
      return 'ASC';
    } else if (descending) {
      return 'DESC';
    } else {
      return null;
    }
  }
}
