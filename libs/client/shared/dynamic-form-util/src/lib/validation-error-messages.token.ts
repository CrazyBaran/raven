import { InjectionToken } from '@angular/core';

function hasProp<K extends PropertyKey>(
  obj: unknown,
  key: K | null | undefined,
): obj is Record<K, unknown> {
  return key != null && obj != null && typeof obj === 'object' && key in obj;
}

export const ERROR_MESSAGES: Record<string, (args?: unknown) => string> = {
  required: () => `This field is required`,
  requiredTrue: () => `This field is required`,
  email: () => `It should be a valid email`,
  minlength: (args: unknown) =>
    `The length should be at least ${
      hasProp(args, 'requiredLength') ? args.requiredLength : ''
    } characters`,
  appPasswordShouldMatch: () => `Password should match`,
  passwordShouldMatch: () => `Password should match`,
  pattern: () => `Wrong format`,
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(
  `Validation Messages`,
  {
    providedIn: 'root',
    factory: (): typeof ERROR_MESSAGES => ERROR_MESSAGES,
  },
);
