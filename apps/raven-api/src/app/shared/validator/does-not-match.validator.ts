import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const DoesNotMatch = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => unknown,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: DoesNotMatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'DoesNotMatch' })
class DoesNotMatchConstraint implements ValidatorConstraintInterface {
  public validate(value: unknown, args: ValidationArguments): boolean {
    const [fn] = args.constraints;
    return fn(args.object) !== value;
  }

  public defaultMessage(args: ValidationArguments): string {
    const [constraintProperty]: (() => unknown)[] = args.constraints;
    return `${(constraintProperty + '').split('.')[1]} and ${
      args.property
    } matches`;
  }
}
