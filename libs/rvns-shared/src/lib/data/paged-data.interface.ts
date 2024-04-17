export interface PagedData<Data> {
  readonly total: number;
  readonly items: Data[];
}

export interface PagedDataWithExtras<Data> extends PagedData<Data> {
  extras: Data[];
}

export interface PagedDataWithCustomExtras<Data> extends PagedData<Data> {
  nextInteraction: string;
}
