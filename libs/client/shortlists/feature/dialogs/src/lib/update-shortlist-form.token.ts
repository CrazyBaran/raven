import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import {
  MAX_SHORTLIST_DESCRIPTION_LENGTH,
  MAX_SHORTLIST_NAME_LENGTH,
  ShortlistForm,
} from '@app/client/shortlists/ui';
import { ShortlistValidatorUtil } from '@app/client/shortlists/utils';
import { map, of } from 'rxjs';

export const UPDATE_SHORTLIST_FORM_FN = new InjectionToken(
  'Update Shortlist Form Group',
  {
    providedIn: 'root',
    factory: (): ((value: {
      name: string;
      description: string;
    }) => ShortlistForm) => {
      const formBuilder = inject(FormBuilder);
      const shortlistService = inject(ShortlistsService);

      return (value): ShortlistForm =>
        formBuilder.group(
          {
            name: [
              value.name,
              {
                validators: [
                  Validators.required,
                  Validators.maxLength(MAX_SHORTLIST_NAME_LENGTH),
                ],
                asyncValidators: [
                  ShortlistValidatorUtil.shortlistNameExistsValidator(
                    (query: string) =>
                      query !== value.name
                        ? shortlistService
                            .getShortlists({
                              query,
                            })
                            .pipe(map((results) => results.data!.items))
                        : of([]),
                  ),
                ],
                updateOn: 'blur',
              },
            ],
            description: [
              value.description,
              [Validators.maxLength(MAX_SHORTLIST_DESCRIPTION_LENGTH)],
            ],
          },
          {
            validators: [
              ShortlistValidatorUtil.shortlistHasChangesValidator(value),
            ],
          },
        );
    },
  },
);
