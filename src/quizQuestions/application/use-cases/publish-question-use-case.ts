import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../api/infrastructure/quiz-questions.repository';
import { NotFoundException } from '@nestjs/common';
import { PublishQuestionUpdateModel } from '../../api/models/input/quiz-questions.input.model';

export class PublishQuestionCommand {
  constructor(
    public id: number,
    public publishQuestionUpdateModel: PublishQuestionUpdateModel,
  ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler {
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}
  async execute(command: PublishQuestionCommand): Promise<boolean> {
    const isPublishedQuestion =
      await this.quizQuestionsRepository.publishQuestion(
        command.id,
        command.publishQuestionUpdateModel.published,
      );
    if (!isPublishedQuestion) {
      throw new NotFoundException();
    }
    return isPublishedQuestion;
  }
}
