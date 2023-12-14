import { CalculationTypeEnum } from '../enums/calculation-type.enum';
import { HeatmapFieldUtils } from './heatmap-field.utils';

describe('HeatmapFieldUtils', () => {
  describe('colours', () => {
    it('ascending order 1', async () => {
      const testConfig = {
        thresholds: [5, 20],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(2);

      expect(result).toStrictEqual('great');
    });
    it('ascending order 2', async () => {
      const testConfig = {
        thresholds: [5, 20],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(10);

      expect(result).toStrictEqual('good');
    });
    it('ascending order 3', async () => {
      const testConfig = {
        thresholds: [5, 20],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(22);

      expect(result).toStrictEqual('average');
    });
    it('descending order 1', async () => {
      const testConfig = {
        thresholds: [20, 5],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(22);

      expect(result).toStrictEqual('great');
    });
    it('descending order 2', async () => {
      const testConfig = {
        thresholds: [20, 5],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(10);

      expect(result).toStrictEqual('good');
    });
    it('descending order 3', async () => {
      const testConfig = {
        thresholds: [20, 5],
      };

      const result =
        HeatmapFieldUtils.withConfig(testConfig).getColourForValue(3);

      expect(result).toStrictEqual('average');
    });
  });

  describe('calculations', () => {
    it('division', async () => {
      const testConfig = {
        calculationConfig: {
          type: CalculationTypeEnum.DIVISION,
          valueIds: ['uuid-1', 'uuid-2'],
        },
      };

      const result = HeatmapFieldUtils.withConfig(
        testConfig,
      ).getCalculatedValue({
        'uuid-1': 2,
        'uuid-2': 1,
      });

      expect(result).toStrictEqual(2);
    });
    it('division by zero', async () => {
      const testConfig = {
        calculationConfig: {
          type: CalculationTypeEnum.DIVISION,
          valueIds: ['uuid-1', 'uuid-2'],
        },
      };

      const result = HeatmapFieldUtils.withConfig(
        testConfig,
      ).getCalculatedValue({
        'uuid-1': 2,
        'uuid-2': 0,
      });

      expect(result).toStrictEqual('Division by zero!');
    });
    it('efficiency', async () => {
      const testConfig = {
        calculationConfig: {
          type: CalculationTypeEnum.EFFICIENCY,
          valueIds: ['uuid-1', 'uuid-2', 'uuid-3'],
        },
      };

      const result = HeatmapFieldUtils.withConfig(
        testConfig,
      ).getCalculatedValue({
        'uuid-1': 24,
        'uuid-2': 2,
        'uuid-3': 1,
      });

      expect(result).toStrictEqual(1);
    });
    it('efficiency - division by zero', async () => {
      const testConfig = {
        calculationConfig: {
          type: CalculationTypeEnum.EFFICIENCY,
          valueIds: ['uuid-1', 'uuid-2', 'uuid-3'],
        },
      };

      const result = HeatmapFieldUtils.withConfig(
        testConfig,
      ).getCalculatedValue({
        'uuid-1': 24,
        'uuid-2': 2,
        'uuid-3': 0,
      });

      expect(result).toStrictEqual('Division by zero!');
    });
    it('incorrect config 1', async () => {
      const testConfig = {
        calculationConfig: {
          type: 'incorrect' as CalculationTypeEnum,
          valueIds: ['uuid-1', 'uuid-2', 'uuid-3'],
        },
      };

      const result = () =>
        HeatmapFieldUtils.withConfig(testConfig).getCalculatedValue({
          'uuid-1': 24,
          'uuid-2': 2,
          'uuid-3': 1,
        });

      expect(result).toThrowError(
        'Configuration is not correct - incorrect type',
      );
    });
    it('incorrect config 2', async () => {
      const testConfig = {
        calculationConfig: {
          type: CalculationTypeEnum.EFFICIENCY,
          valueIds: ['uuid-1', 'uuid-2'],
        },
      };

      const result = () =>
        HeatmapFieldUtils.withConfig(testConfig).getCalculatedValue({
          'uuid-1': 24,
          'uuid-2': 2,
          'uuid-3': 1,
        });

      expect(result).toThrowError(
        'Configuration is not correct - calculationConfig should have exactly 3 valueIds for efficiency calculation',
      );
    });
  });
});
