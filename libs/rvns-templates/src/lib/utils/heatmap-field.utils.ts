import { CalculationConfigData } from '../data/field-definition-data.interface';
import { HeatMapValue, heatMapValues } from '../enums/heat-map.value';

export interface HeatmapConfigData {
  readonly thresholds: number[];
  readonly calculationConfig?: CalculationConfigData;
}

export class HeatmapFieldUtils {
  private readonly colours: readonly HeatMapValue[];
  private readonly config: HeatmapConfigData;

  private constructor(
    config: HeatmapConfigData,
    colours: readonly HeatMapValue[] = heatMapValues,
  ) {
    this.config = config;
    this.colours = colours;
  }

  public static withConfig(
    config: HeatmapConfigData,
    colours?: readonly HeatMapValue[],
  ): HeatmapFieldUtils {
    return new HeatmapFieldUtils(config, colours);
  }

  public getColourForValue(value: number): HeatMapValue | null {
    const { thresholds } = this.config;

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
    return null;
  }

  public getCalculatedValue(valueMap: {
    [key: string]: number | null;
  }): number | null {
    return 43;
  }

  private getColourForIndex(index: number): HeatMapValue {
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
