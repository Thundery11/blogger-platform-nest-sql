import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';

export class CreateCommentInputModel {
  @Trim()
  @IsString()
  @Length(20, 300)
  content: string;
}

export class CreateCommentDto {
  constructor(
    public userId: number,
    public postId: number,
    public createdAt: string,
    public content: string,
  ) {}
}
