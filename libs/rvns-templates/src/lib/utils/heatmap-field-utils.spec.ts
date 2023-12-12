import { HeatmapFieldUtils } from './heatmap-field.utils';

describe('HeatmapFieldUtils', () => {
  it('ascending order', async () => {
    const testConfig = {
      thresholds: [5, 20],
    };

    const heatmapFieldUtils = new HeatmapFieldUtils();
    const result = heatmapFieldUtils.getColourForField(testConfig, 10);

    expect(result).toStrictEqual('#FFFF00');
  });
  it('ascending order, 2', async () => {
    const testConfig = {
      thresholds: [5, 20],
    };

    const heatmapFieldUtils = new HeatmapFieldUtils();
    const result = heatmapFieldUtils.getColourForField(testConfig, 22);

    expect(result).toStrictEqual('#FF0000');
  });
  it('descending order', async () => {
    const testConfig = {
      thresholds: [20, 5],
    };

    const heatmapFieldUtils = new HeatmapFieldUtils();
    const result = heatmapFieldUtils.getColourForField(testConfig, 22);

    expect(result).toStrictEqual('#00FF00');
  });
  it('custom colours', async () => {
    const testConfig = {
      thresholds: [15, 10, 5],
    };

    const heatmapFieldUtils = new HeatmapFieldUtils([
      'first',
      'second',
      'third',
      'fourth',
    ]);
    const result = heatmapFieldUtils.getColourForField(testConfig, 2);

    expect(result).toStrictEqual('fourth');
  });
});
