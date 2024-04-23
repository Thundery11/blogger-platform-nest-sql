import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsCreateModel } from '../../api/models/input/quiz-questions.input.model';
import { QuizQuestionsOutputModel } from '../../api/models/output/quizQuestions.output.model';
import { QuizQuestions } from '../../domain/quiz-questions.entity';
import { QuizQuestionsRepository } from '../../api/infrastructure/quiz-questions.repository';

export class CreateQuizQuestionCommand {
  constructor(public quizQuestionsCreateModel: QuizQuestionsCreateModel) {}
}

@CommandHandler(CreateQuizQuestionCommand)
export class CreateQuizQuestionUseCase
  implements ICommandHandler<CreateQuizQuestionCommand>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}
  async execute(
    command: CreateQuizQuestionCommand,
  ): Promise<QuizQuestionsOutputModel> {
    const { quizQuestionsCreateModel } = command;
    const published = false;
    const createdAt = new Date().toISOString();

    const quizQuestion = new QuizQuestions();
    quizQuestion.body = quizQuestionsCreateModel.body;
    quizQuestion.correctAnswers = quizQuestionsCreateModel.correctAnswers;
    quizQuestion.createdAt = createdAt;
    quizQuestion.published = published;
    return await this.quizQuestionsRepository.createQuizQuestion(quizQuestion);
  }
}
