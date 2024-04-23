import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../api/infrastructure/quiz-questions.repository';

export class DeleteQuizQuestionCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteQuizQuestionCommand)
export class DeleteQuizQuestionUseCase
  implements ICommandHandler<DeleteQuizQuestionCommand>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}
  async execute(command: DeleteQuizQuestionCommand): Promise<boolean> {
    return await this.quizQuestionsRepository.deleteQuizQuestion(command.id);
  }
}
