import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class UserCreateModel {
  @Trim()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @Trim()
  @IsString()
  @Length(6, 20)
  password: string;

  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class UserData {
  userId: string;
  userLogin: string;
}
