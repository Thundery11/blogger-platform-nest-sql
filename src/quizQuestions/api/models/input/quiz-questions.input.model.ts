import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  IsArrayOfStrings,
  IsArrayOfStringsValidator,
} from '../../../../infrastucture/decorators/validate/is-array-of-strings';

export class QuizQuestionsCreateModel {
  @IsString()
  @Length(10, 500)
  body: string;

  @IsArray()
  @IsArrayOfStringsValidator()
  readonly correctAnswers: string[];
}

export class PublishQuestionUpdateModel {
  @IsBoolean()
  published: boolean;
}
