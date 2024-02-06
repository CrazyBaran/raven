import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { OrganisationsService } from '@app/client/organisations/data-access';
import { Observable, map } from 'rxjs';

export class DomainValidators {
  public static createDomainExistsValidator(
    organisationService: OrganisationsService,
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return organisationService
        .checkIfDomainExists(control.value)
        .pipe(
          map(
            (result: boolean) =>
              (result ? { domainAlreadyExists: true } : null)!,
          ),
        );
    };
  }

  public static validDomain(control: AbstractControl): ValidationErrors | null {
    const domain = control.value;
    const domainPattern = new RegExp(
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
    );
    return domainPattern.test(domain) ? null : { invalidDomain: true };
  }
}
