export class BaseArrayPropertiesStaticDataDto {
  protected compareArray(thisArray: string[], otherArray: string[]): boolean {
    return (
      thisArray.length === otherArray.length &&
      thisArray.every((value, index) => value === otherArray[index]) &&
      otherArray.every((value, index) => value === thisArray[index])
    );
  }
}
