import { BaseChange } from '../dto/change.dto';

export interface Comparer<T> {
  compareOne(oldData: T, newData: T): BaseChange;
  compareMany(oldData: T[], newData: T[]): BaseChange[];
  unsetNestedProperties(changes: BaseChange[]): void;
}
