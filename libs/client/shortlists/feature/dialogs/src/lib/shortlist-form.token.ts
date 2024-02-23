import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShortlistsService } from '@app/client/shortlists/data-access';
import {
  MAX_SHORTLIST_DESCRIPTION_LENGTH,
  MAX_SHORTLIST_NAME_LENGTH,
  ShortlistForm,
} from '@app/client/shortlists/ui';
import { ShortlistValidatorUtil } from '@app/client/shortlists/utils';
import { map } from 'rxjs';

export const SHORTLIST_FORM = new InjectionToken<ShortlistForm>(
  'Create Shortlist Form Group',
);

export const provideShortlistForm = {
  provide: SHORTLIST_FORM,
  useFactory: (): ShortlistForm => {
    const formBuilder = inject(FormBuilder);
    const shortlistService = inject(ShortlistsService);

    return formBuilder.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(MAX_SHORTLIST_NAME_LENGTH),
          ],
          asyncValidators: [
            ShortlistValidatorUtil.shortlistNameExistsValidator(
              (query: string) =>
                shortlistService
                  .getShortlists({
                    query,
                  })
                  .pipe(map((results) => results.data!.items)),
            ),
          ],
          updateOn: 'blur',
        },
      ],
      description: [
        '',
        [Validators.maxLength(MAX_SHORTLIST_DESCRIPTION_LENGTH)],
      ],
    });
  },
};
