import { HeatmapFieldUtils } from './heatmap-field.utils';

describe('HeatmapFieldUtils', () => {
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
