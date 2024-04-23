import { QuizQuestions } from '../../../domain/quiz-questions.entity';

export class QuizQuestionsOutputModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export const quizQuestionOutputMapper = (
  newQuizQuestion: QuizQuestions,
): QuizQuestionsOutputModel => {
  const output = new QuizQuestionsOutputModel();
  output.id = newQuizQuestion.id.toString();
  output.body = newQuizQuestion.body;
  output.correctAnswers = newQuizQuestion.correctAnswers;
  output.createdAt = newQuizQuestion.createdAt;
  output.published = newQuizQuestion.published;
  output.updatedAt = newQuizQuestion.updatedAt;
  return output;
};
