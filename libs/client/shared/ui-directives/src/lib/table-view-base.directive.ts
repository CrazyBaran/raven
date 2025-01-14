import { Directive, Input } from '@angular/core';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';

export interface TableViewModel<T> {
  data: T[];
  isLoading: boolean;
  total: number | string;
  take: number | string;
  skip: number | string;
  field: string;
  dir: 'asc' | 'desc' | string;
  pageable?: PagerSettings | boolean;
  filters?: CompositeFilterDescriptor;
}

@Directive()
export abstract class TableViewBaseComponent<T> {
  @Input() public model: TableViewModel<T> | null;

  public get data(): T[] {
    return this.model?.data ?? [];
  }

  public get isLoading(): boolean {
    return this.model?.isLoading ?? true;
  }

  public get total(): number {
    return Number(this.model?.total);
  }

  public get take(): number {
    return Number(this.model?.take);
  }

  public get skip(): number {
    return Number(this.model?.skip);
  }

  public get field(): string | null {
    return this.model?.field ?? null;
  }

  public get dir(): 'asc' | 'desc' | null {
    if (!this.model?.dir) return null;

    if (this.model.dir === 'asc' || this.model.dir === 'desc') {
      return this.model.dir;
    }

    // console.warn(`Unknown sort direction: ${this.model.dir}`);

    return null;
  }

  public get gridData(): GridDataResult {
    return {
      data: this.data,
      total: this.total,
    };
  }

  public get sort(): SortDescriptor[] {
    return this.field
      ? [{ field: this.field, dir: this.dir as 'asc' | 'desc' }]
      : [];
  }

  public get pageable(): PagerSettings | boolean {
    return (
      this.model?.pageable ?? {
        pageSizes: [15, 25, 50, 100].filter(
          (pageSize) => pageSize <= this.total,
        ),
      }
    );
  }

  public get filters(): CompositeFilterDescriptor | null {
    return this.model?.filters ?? null;
  }
}
