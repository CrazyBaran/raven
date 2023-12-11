//test for maxVisibleIndex

import { maxVisibleIndex } from './max-visible-index';

describe('maxVisibleIndex', () => {
  it('should return the correct max visible index', () => {
    const width = 450;
    const tagsLength = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const tooltipWidth = 20;
    const rows = 1;
    const expected = 3;

    const result = maxVisibleIndex(width, tagsLength, tooltipWidth, rows);

    expect(result).toBe(expected);
  });

  it('should return the correct max visible index when the last tag is not the overflow and there is no tooltip width', () => {
    const width = 450;
    const tagsLength = [100, 100, 100, 100, 100, 100, 100, 100, 100, 50];
    const tooltipWidth = undefined;
    const rows = 1;
    const expected = 3;

    const result = maxVisibleIndex(width, tagsLength, tooltipWidth, rows);

    expect(result).toBe(expected);
  });

  it('should return the correct max visible index when there are multiple rows', () => {
    const width = 450;
    const tagsLength = [100, 100, 100, 100, 100, 100, 100, 100, 100, 50];
    const tooltipWidth = 20;
    const rows = 2;
    const expected = 7;

    const result = maxVisibleIndex(width, tagsLength, tooltipWidth, rows);

    expect(result).toBe(expected);
  });

  it('should return the correct max visible index for edge case', () => {
    const width = 210;
    const tagsLength = [72, 75, 75, 110, 91];
    const tooltipWidth = 20;
    const rows = 2;
    const expected = 3;

    const result = maxVisibleIndex(width, tagsLength, tooltipWidth, rows);

    expect(result).toBe(expected);
  });

  it('should return the correct max visible index for edge case 2', () => {
    const width = 196;
    const tagsLength = [73.421875, 76.46875, 76.46875, 111.90625, 92.359375];
    const tooltipWidth = 22;
    const rows = 3;
    const expected = 4;

    const result = maxVisibleIndex(width, tagsLength, tooltipWidth, rows);

    expect(result).toBe(expected);
  });
});
