import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as _ from 'lodash';
import { Observable, map } from 'rxjs';

export class ShortlistValidatorUtil {
  public static shortlistNameExistsValidator(
    sourceFn$: (query: string) => Observable<{ name: string }[]>,
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return sourceFn$(control.value).pipe(
        map(
          (results) =>
            (results.some(
              (r) => r.name?.toLowerCase() === control.value?.toLowerCase(),
            )
              ? { shortlistNameExists: true }
              : null)!,
        ),
      );
    };
  }

  public static shortlistHasChangesValidator(initialValue: {
    name: string;
    description: string;
  }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return _.isEqual(control.value, initialValue)
        ? { shortlistHasChanges: true }
        : null;
    };
  }
}
