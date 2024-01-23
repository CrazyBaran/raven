export class DataWarehouseParser {
  public static parseSemicolonData(data: string): string[] {
    if (!data) {
      return [];
    }
    const splitData = data.split(';');
    return splitData.map((item) => item.trim());
  }
}
