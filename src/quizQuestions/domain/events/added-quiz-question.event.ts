import { QuizQuestionsCreateModel } from '../../api/models/input/quiz-questions.input.model';

export class QuizQuestionAddedEvent {
  constructor(public quizQuestionsCreateModel: QuizQuestionsCreateModel) {}
}
