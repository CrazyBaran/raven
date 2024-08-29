/* eslint-disable @typescript-eslint/no-explicit-any,@nx/enforce-module-boundaries */
import { inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ManagerForm,
  MAX_MANAGER_CURRENCY_LENGTH,
  MAX_MANAGER_DESCRIPTION_LENGTH,
} from '@app/client/managers/ui';
import { FundManagerData } from '@app/rvns-fund-managers';

export const UPDATE_MANAGER_FORM_FN = new InjectionToken(
  'Update Manager Form Group',
  {
    providedIn: 'root',
    factory: (): ((value: FundManagerData) => ManagerForm) => {
      const formBuilder = inject(FormBuilder);

      return (value): ManagerForm => {
        return formBuilder.group({
          description: [
            value.description,
            [Validators.maxLength(MAX_MANAGER_DESCRIPTION_LENGTH)],
          ],
          strategy: [
            value.strategy,
            [Validators.maxLength(MAX_MANAGER_DESCRIPTION_LENGTH)],
          ],
          avgCheckSize: [
            value.avgCheckSize,
            [Validators.maxLength(MAX_MANAGER_CURRENCY_LENGTH)],
          ],
          geography: [value.geography?.split(', ') || []],
          industryTags: [value.industryTags || []],
        });
      };
    },
  },
);
