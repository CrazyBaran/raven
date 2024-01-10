export class BaseArrayPropertiesStaticDataDto {
  protected compareArray(thisArray: string[], otherArray: string[]): boolean {
    if (this.isEmptyArray(thisArray) && this.isEmptyArray(otherArray)) {
      return true;
    }
    if (this.isEmptyArray(thisArray) || this.isEmptyArray(otherArray)) {
      return false;
    }
    return (
      thisArray.length === otherArray.length &&
      thisArray.every((value, index) => value === otherArray[index]) &&
      otherArray.every((value, index) => value === thisArray[index])
    );
  }

  protected isEmptyArray(array: string[]): boolean {
    return array === undefined || array === null || array.length === 0;
  }
}
