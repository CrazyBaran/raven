import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';

@Pipe({
  name: 'controlInvalid$',
  standalone: true,
})
export class ControlInvalidPipe implements PipeTransform {
  public transform(
    abstractControl: AbstractControl | null | undefined,
  ): Observable<boolean> {
    if (!abstractControl) {
      console.error('ControlInvalidPipe: abstractControl is null');
      return of(true);
    }
    return abstractControl.statusChanges.pipe(
      startWith(abstractControl.status),
      map(() => abstractControl.invalid),
    );
  }
}
