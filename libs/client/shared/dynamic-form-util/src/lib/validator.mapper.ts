// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ValidatorFn, Validators } from '@angular/forms';
import { ValidatorKeys } from './dynamic-forms.model';

export const validatorMapper: Record<
  ValidatorKeys,
  (value: unknown) => ValidatorFn
> = {
  required: () => Validators.required,
  email: () => Validators.email,
  requiredTrue: () => Validators.requiredTrue,
  minLength: (value: unknown) =>
    typeof value === 'number'
      ? Validators.minLength(value)
      : Validators.nullValidator,
  maxLength: (value: unknown) =>
    typeof value === 'number'
      ? Validators.maxLength(value)
      : Validators.nullValidator,
  min: (value: unknown) =>
    typeof value === 'number'
      ? Validators.min(value)
      : Validators.nullValidator,
  max: (value: unknown) =>
    typeof value === 'number'
      ? Validators.max(value)
      : Validators.nullValidator,
  pattern: (value: unknown) =>
    typeof value === 'string'
      ? Validators.pattern(value)
      : Validators.nullValidator,
  nullValidator: () => Validators.nullValidator,
};
