import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BlogsQueryRepository } from '../../../features/blogs/infrastructure/blogs.query-repository';
import { Types } from 'mongoose';

export function IsBlogAlreadyExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBlogExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'blogId', async: false })
@Injectable()
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const blog = await this.blogsQueryRepository.getBlogById(Number(value));
    console.log('blog', blog);
    if (!blog) return false;
    return true;
  }
}
