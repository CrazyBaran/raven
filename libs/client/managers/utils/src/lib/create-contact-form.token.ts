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
            [Validators.maxLength(MAX_CONTACT_NAME_LENGTH)],
          ],
          linkedin: [
            value?.linkedin || '',
            [Validators.maxLength(MAX_CONTACT_NAME_LENGTH)],
          ],
        });
      };
    },
  },
);
