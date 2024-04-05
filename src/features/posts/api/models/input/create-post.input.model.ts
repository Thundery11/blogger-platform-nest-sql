import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { Trim } from '../../../../../infrastucture/decorators/transform/trim';
import { IsBlogAlreadyExist } from '../../../../../infrastucture/decorators/validate/is-blog-exist-decorator';

export class PostCreateModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, { message: 'Length not correct' })
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Length not correct' })
  shortDescription: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Length not correct' })
  content: string;
}

export class PostCreateModelWithBlogId {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, { message: 'Length not correct' })
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Length not correct' })
  shortDescription: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Length not correct' })
  content: string;

  @Trim()
  @IsString()
  @IsBlogAlreadyExist()
  blogId: string;
}

export class PostUpdateModel {
  @Trim()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  shortDescription: string;

  @Trim()
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  content: string;
}
