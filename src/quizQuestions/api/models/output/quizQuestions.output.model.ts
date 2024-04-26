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

export const allQuizQuestionOutputMapper = (
  questions: QuizQuestions[],
): QuizQuestionsOutputModel[] => {
  const output = questions.map((q) => ({
    id: q.id.toString(),
    body: q.body,
    correctAnswers: q.correctAnswers,
    published: q.published,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  }));
  return output;
};
