/* eslint-disable @typescript-eslint/no-explicit-any,@nx/enforce-module-boundaries */
import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactForm, MAX_CONTACT_NAME_LENGTH } from '@app/client/managers/ui';
import { FundManagerContactData } from '@app/rvns-fund-managers';

export const CREATE_CONTACT_FORM_FN = new InjectionToken(
  'Create Contact Form Group',
  {
    providedIn: 'root',
    factory: (): ((value?: FundManagerContactData) => ContactForm) => {
      const formBuilder = inject(FormBuilder);

      return (value): ContactForm => {
        const urlRegex =
          '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?';

        return formBuilder.group({
          name: [
            value?.name || '',
            [
              Validators.required,
              Validators.maxLength(MAX_CONTACT_NAME_LENGTH),
            ],
          ],
          position: [
            value?.position || '',
            [Validators.maxLength(MAX_CONTACT_NAME_LENGTH)],
          ],
          relationStrength: [value?.relationStrength || null],
          email: [
            value?.email || '',
            [Validators.maxLength(MAX_CONTACT_NAME_LENGTH), Validators.email],
          ],
          linkedin: [
            value?.linkedin || '',
            [
              Validators.maxLength(MAX_CONTACT_NAME_LENGTH),
              Validators.pattern(urlRegex),
            ],
          ],
        });
      };
    },
  },
);
