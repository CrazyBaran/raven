import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'orderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  public transform<T>(
    array: T[],
    field: string,
    order: 'asc' | 'desc' = 'asc',
  ): T[] {
    return _.orderBy(array, [field], [order]);
  }
}
