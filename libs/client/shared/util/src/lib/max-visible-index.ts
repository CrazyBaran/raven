import * as _ from 'lodash';
export const maxVisibleIndex = (
  width: number,
  tagsLength: number[],
  tooltipWidth?: number,
  rows?: number,
): number => {
  const x = tagsLength.reduce(
    ({ index, arr }, tagWidth) => {
      const currentRowSum = arr[index].reduce((a, b) => a + b, 0);
      const isOverflow = currentRowSum + tagWidth > width;
      if (isOverflow) {
        index++;
        arr.push([tagWidth]);
      } else {
        arr[index].push(tagWidth);
      }
      return { index, arr };
    },
    {
      index: 0,
      arr: [[]] as number[][],
    },
  );

  const takenRows = x.arr.slice(0, rows ?? x.arr.length);
  const haveAllTiles = tagsLength.length === _.flatten(takenRows).length;

  if (haveAllTiles) {
    return tagsLength.length - 1;
  }

  const lastRow = takenRows[takenRows.length - 1];
  const lastRowSum = lastRow.reduce((a, b) => a + b, 0);

  if (lastRowSum + tooltipWidth! > width) {
    lastRow.pop();
  }

  return _.flatten(takenRows).length - 1;
};
