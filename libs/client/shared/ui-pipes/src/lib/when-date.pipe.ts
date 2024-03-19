import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whenDate',
  standalone: true,
})
export class WhenDatePipe implements PipeTransform {
  public transform(date?: Date | string, withHours?: boolean): string | null {
    if (!date) {
      return null;
    }

    const datePipe = new DatePipe('en-UK');
    const entryDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let result = '';

    if (this._compareDates(entryDate, today)) {
      result = 'Today';
    } else if (this._compareDates(entryDate, yesterday)) {
      result = 'Yesterday';
    } else {
      result = datePipe.transform(entryDate, 'dd.MM.yyyy')!;
    }

    return `${result} ${
      withHours ? datePipe.transform(entryDate, 'hh:mm a') : ''
    }`;
  }

  private _compareDates(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }
}
