import { IsString, Length } from 'class-validator';

export class QuizQuestionsCreateModel {
  @IsString()
  @Length(10, 500)
  body: string;

  correctAnswers: string[];
}
