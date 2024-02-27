import {
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GridComponent,
  GridDataResult,
  GridItem,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';

export interface InfinityTableViewModel<T> {
  data: T[];
  isLoading: boolean;
  total: number | string;
  take: number | string;
  skip: number | string;
  field: string;
  dir: 'asc' | 'desc' | string;
  filters?: CompositeFilterDescriptor;
}

@Directive()
export abstract class InfinityTableViewBaseComponent<T> {
  @ViewChild(GridComponent) public grid!: GridComponent;

  @Input() public model: InfinityTableViewModel<T> | null;

  @Output() public loadMore = new EventEmitter<{
    skip: number;
    take: number;
  }>();

  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public page = 0;

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

  public get filters(): CompositeFilterDescriptor | null {
    return this.model?.filters ?? null;
  }

  public onLoadMore(): void {
    if (this.total <= this.data.length || this.model?.isLoading) {
      return;
    }

    this.page++;

    this.loadMore.emit({
      skip: this.page * this.take,
      take: this.take,
    });
  }

  public reset(): void {
    this.grid?.scrollTo({
      row: 0,
    });
    this.page = 0;
  }

  public getTrackByFn(key: keyof T): TrackByFunction<GridItem> {
    return (index, item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return key in item.data ? (item.data as any)[key] : index;
    };
  }
}
