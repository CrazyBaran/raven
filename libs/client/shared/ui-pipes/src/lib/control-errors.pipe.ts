import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';

@Pipe({
  name: 'controlErrors$',
  standalone: true,
})
export class ControlErrorsPipe implements PipeTransform {
  public transform(
    abstractControl: AbstractControl | null | undefined,
  ): Observable<ValidationErrors | null> {
    if (!abstractControl) {
      console.error('ControlStatePipe: abstractControl is null');
      return of(null);
    }
    return abstractControl.statusChanges.pipe(
      startWith(abstractControl.errors),
      map(() => abstractControl.errors),
    );
  }
}
