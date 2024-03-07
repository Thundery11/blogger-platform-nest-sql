import { IsString } from 'class-validator';
import { setTimeout } from 'timers/promises';

export class ConfirmationCodeInputModel {
  @IsString()
  code: string;
}
