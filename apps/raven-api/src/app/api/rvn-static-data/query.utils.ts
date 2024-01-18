export class QueryUtils {
  public static prepareMultiparamQuery(
    baseQuery: string,
    ids: string[],
  ): string {
    return `${baseQuery} ${ids
      .map((_, index) => `(@${index * 2}, @${index * 2 + 1})`)
      .join(',')}`;
  }

  public static prepareMultiparamQueryParameters(
    singleId: string,
    ids: string[],
  ): string[] {
    return ids.reduce((acc, id) => acc.concat([singleId, id]), []);
  }
}
