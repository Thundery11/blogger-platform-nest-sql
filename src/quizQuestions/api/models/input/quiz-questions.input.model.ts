import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
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
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return false;
    } else {
      return value.map((a) => a.toString().trim());
    }
  })
  correctAnswers: string[];
}

export class PublishQuestionUpdateModel {
  @IsBoolean()
  published: boolean;
}

export class SortingQueryParamsForQuiz {
  bodySearchTerm?: string;
  publishedStatus: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
}
