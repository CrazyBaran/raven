export class DataWarehouseParser {
  public static parseSemicolonData(data: string): string[] {
    if (!data) {
      return [];
    }
    const splitData = data.split(';');
    return splitData.map((item) => item.trim());
  }

  public static parseSemicolonKeyValue(data: string): {
    [key: string]: number;
  }[] {
    if (!data) {
      return [];
    }
    const parsedData = this.parseSemicolonData(data);
    return parsedData.map((item) => {
      const regex = /(.*)\s(\d*\.?\d*)%/;
      const match = item.match(regex);
      if (!match) {
        return null;
      }
      return {
        [match[1]]: parseFloat(match[2]),
      };
    });
  }
}
