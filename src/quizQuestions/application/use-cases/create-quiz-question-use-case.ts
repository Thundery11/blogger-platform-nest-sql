import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
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
  constructor(
    private quizQuestionsRepository: QuizQuestionsRepository,
    private eventBus: EventBus,
  ) {}
  async execute(
    command: CreateQuizQuestionCommand,
  ): Promise<QuizQuestionsOutputModel> {
    const { quizQuestionsCreateModel } = command;

    const quizQuestion = QuizQuestions.addQuizQuestion(
      quizQuestionsCreateModel,
    );
    const createdQuestion =
      await this.quizQuestionsRepository.createQuizQuestion(quizQuestion);
    quizQuestion.events.forEach((e) => {
      this.eventBus.publish(e);
    });
    return createdQuestion;
  }
}
