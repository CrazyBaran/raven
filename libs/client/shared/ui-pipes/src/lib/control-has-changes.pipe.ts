import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, map, of, startWith } from 'rxjs';

@Pipe({
  name: 'controlHasChanges$',
  standalone: true,
})
export class ControlHasChangesPipe implements PipeTransform {
  public transform<T>(
    abstractControl: AbstractControl<T> | null | undefined,
    initialValue: T,
  ): Observable<boolean> {
    if (!abstractControl) {
      console.error('ControlHasChangesPipe: abstractControl is null');
      return of(false);
    }

    return abstractControl.valueChanges.pipe(
      startWith(abstractControl.value),
      map((value) => !_.isEqual(value, initialValue)),
    );
  }
}
