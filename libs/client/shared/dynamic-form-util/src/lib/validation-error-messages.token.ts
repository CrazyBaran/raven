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
  min: (args: unknown) =>
    `Value must be equal or greater than ${
      hasProp(args, 'min') ? args.min : ''
    }`,
  max: (args: unknown) =>
    `Value must be equal or less than ${hasProp(args, 'max') ? args.max : ''}`,
  minlength: (args: unknown) =>
    `The length should be at least ${
      hasProp(args, 'requiredLength') ? args.requiredLength : ''
    } characters`,
  maxlength: (args: unknown) =>
    `The length should be less than ${
      hasProp(args, 'requiredLength') ? args.requiredLength : ''
    } characters`,
  appPasswordShouldMatch: () => `Password should match`,
  passwordShouldMatch: () => `Password should match`,
  pattern: () => `Wrong format`,
  dynamicError: (args: unknown) =>
    hasProp(args, 'message') ? String(args.message) : '',
  domainAlreadyExists: () => `Domain already exists`,
  invalidDomain: () => `Invalid domain`,
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(
  `Validation Messages`,
  {
    providedIn: 'root',
    factory: (): typeof ERROR_MESSAGES => ERROR_MESSAGES,
  },
);
