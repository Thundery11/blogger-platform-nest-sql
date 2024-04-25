import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isArrayOfStrings', async: false })
@Injectable()
export class IsArrayOfStrings implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((item) => typeof item === 'string');
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each item in $property must be a string';
  }
}

export function IsArrayOfStringsValidator(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsArrayOfStrings,
    });
  };
}
