export interface PagedData<Data> {
  readonly total: number;
  readonly items: Data[];
}
