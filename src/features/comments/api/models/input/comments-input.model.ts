import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class CreateCommentInputModel {
  @Trim()
  @IsString()
  @Length(20, 300)
  content: string;
}
