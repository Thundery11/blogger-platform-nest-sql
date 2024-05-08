// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidationArguments,
// } from 'class-validator';

// export function IsNumberStringFormat(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isNumberStringFormat',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           const regExp = /^[0-9]+$/;
//           return typeof value === 'string' && regExp.test(value);
//         },
//         defaultMessage(args: ValidationArguments) {
//           return `${args.property} has an invalid number format`;
//         },
//       },
//     });
//   };
// }
