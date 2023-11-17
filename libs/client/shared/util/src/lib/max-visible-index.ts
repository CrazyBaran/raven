export const maxVisibleIndex = (
  width: number,
  tagsLength: number[],
  tooltipWidth?: number,
): number => {
  let currentWidth = 0;
  let maxVisibleIndex = -1;

  tagsLength.every((tagWidth: number, index: number) => {
    const isLast = index === tagsLength.length - 1;

    let totalWidth = currentWidth + tagWidth;

    if (!isLast) {
      totalWidth += tooltipWidth ?? 0;
    }

    const isOverflow = totalWidth > width;

    if (isOverflow) {
      return false;
    }

    currentWidth += tagWidth;
    maxVisibleIndex = index;

    return true;
  });

  return maxVisibleIndex;
};
