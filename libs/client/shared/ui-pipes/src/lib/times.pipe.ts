import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'times',
  standalone: true,
})
export class TimesPipe implements PipeTransform {
  public transform(number: number): number[] {
    return Array(number)
      .fill(0)
      .map((_, i) => i);
  }
}
