import { IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class EmailResendingInputModel {
  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
