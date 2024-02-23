import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControlStatus } from '@angular/forms';
import { Observable, of, startWith } from 'rxjs';

@Pipe({
  name: 'controlState$',
  standalone: true,
})
export class ControlStatePipe implements PipeTransform {
  public transform(
    abstractControl: AbstractControl | null | undefined,
  ): Observable<FormControlStatus> {
    if (!abstractControl) {
      console.error('ControlStatePipe: abstractControl is null');
      return of('INVALID');
    }
    return abstractControl.statusChanges.pipe(
      startWith(abstractControl.status),
    );
  }
}
