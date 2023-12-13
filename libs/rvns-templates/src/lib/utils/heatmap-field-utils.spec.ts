import { HeatmapFieldUtils } from './heatmap-field.utils';

describe('HeatmapFieldUtils', () => {
  it('ascending order 1', async () => {
    const testConfig = {
      thresholds: [5, 20],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(2);

    expect(result).toStrictEqual('#00FF00');
  });
  it('ascending order 2', async () => {
    const testConfig = {
      thresholds: [5, 20],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(10);

    expect(result).toStrictEqual('#FFFF00');
  });
  it('ascending order 3', async () => {
    const testConfig = {
      thresholds: [5, 20],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(22);

    expect(result).toStrictEqual('#FF0000');
  });
  it('descending order 1', async () => {
    const testConfig = {
      thresholds: [20, 5],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(22);

    expect(result).toStrictEqual('#00FF00');
  });
  it('descending order 2', async () => {
    const testConfig = {
      thresholds: [20, 5],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(10);

    expect(result).toStrictEqual('#FFFF00');
  });
  it('descending order 3', async () => {
    const testConfig = {
      thresholds: [20, 5],
    };

    const result =
      HeatmapFieldUtils.withConfig(testConfig).getColourForValue(3);

    expect(result).toStrictEqual('#FF0000');
  });
  it('custom colours', async () => {
    const testConfig = {
      thresholds: [15, 10, 5],
    };

    const colours = ['first', 'second', 'third', 'fourth'];
    const result = HeatmapFieldUtils.withConfig(
      testConfig,
      colours,
    ).getColourForValue(2);

    expect(result).toStrictEqual('fourth');
  });
});
