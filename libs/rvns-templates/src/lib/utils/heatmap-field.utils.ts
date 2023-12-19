import { CalculationConfigData } from '../data/field-definition-data.interface';
import { CalculationTypeEnum } from '../enums/calculation-type.enum';
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
        if (value < thresholds[i]) {
          return this.getColourForIndex(i);
        }
      }
      return this.getColourForIndex(thresholds.length);
    }
    if (direction === 'DESC') {
      for (let i = 0; i < thresholds.length; i++) {
        if (value > thresholds[i]) {
          return this.getColourForIndex(i);
        }
      }
      return this.getColourForIndex(thresholds.length);
    }
    return null;
  }

  public getCalculatedValue(valueMap: {
    [key: string]: number | null | undefined;
  }): number | string | null {
    if (this.config.calculationConfig?.type === CalculationTypeEnum.DIVISION) {
      return this.calculateDivision(valueMap);
    }
    if (
      this.config.calculationConfig?.type === CalculationTypeEnum.EFFICIENCY
    ) {
      return this.calculateEfficiency(valueMap);
    }
    if (
      this.config.calculationConfig?.type ===
      CalculationTypeEnum.DIVISION_MULTIPLIED
    ) {
      const multiplier = this.config.calculationConfig?.multiplier;
      if (!multiplier) {
        throw new Error(
          'Configuration is not correct - no multiplier for division_multiplied calculation',
        );
      }
      const divisionResult = this.calculateDivision(valueMap);
      if (typeof divisionResult !== 'number') {
        return divisionResult;
      }
      return divisionResult * multiplier;
    }
    throw new Error('Configuration is not correct - incorrect type');
  }

  private calculateDivision(valueMap: {
    [key: string]: number | null | undefined;
  }): number | string | null {
    const { calculationConfig } = this.config;
    if (!calculationConfig) {
      throw new Error('Configuration is not correct - no calculationConfig');
    }

    const valueIds = calculationConfig.valueIds.map((vid) => vid.toLowerCase());

    if (!valueIds || valueIds.length !== 2) {
      throw new Error(
        'Configuration is not correct - calculationConfig should have exactly 2 valueIds for division calculation',
      );
    }

    const numerator = valueMap[valueIds[0]];
    const denominator = valueMap[valueIds[1]];

    if (numerator == null || denominator == null) {
      return null;
    }

    if (denominator === 0) {
      return 'Division by zero!';
    }

    return numerator / denominator;
  }

  private calculateEfficiency(valueMap: {
    [p: string]: number | null | undefined;
  }): number | string | null {
    const { calculationConfig } = this.config;
    if (!calculationConfig) {
      throw new Error('Configuration is not correct - no calculationConfig');
    }

    const valueIds = calculationConfig.valueIds.map((vid) => vid.toLowerCase());

    if (!valueIds || valueIds.length !== 3) {
      throw new Error(
        'Configuration is not correct - calculationConfig should have exactly 3 valueIds for efficiency calculation',
      );
    }

    const arr = valueMap[valueIds[0]];
    const ltm = valueMap[valueIds[1]];
    const burn = valueMap[valueIds[2]];

    if (arr == null || ltm == null || burn == null) {
      return null;
    }

    if (ltm === 0 || burn === 0) {
      return 'Division by zero!';
    }

    return (arr - arr / ltm) / (burn * 12);
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
