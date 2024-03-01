import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'picklist',
  standalone: true,
})
export class PicklistPipe implements PipeTransform {
  public transform<T>(list: T[], key: keyof T): T[keyof T][] {
    return list.map((item) => item[key]);
  }
}
