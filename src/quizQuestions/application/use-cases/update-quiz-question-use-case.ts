import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../api/infrastructure/quiz-questions.repository';
import { QuizQuestionsCreateModel } from '../../api/models/input/quiz-questions.input.model';
import { NotFoundException } from '@nestjs/common';

export class UpdateQuizQuestionCommand {
  constructor(
    public quizUpdateModel: QuizQuestionsCreateModel,
    public id: number,
  ) {}
}

@CommandHandler(UpdateQuizQuestionCommand)
export class UpdateQuizQuestionUseCase implements ICommandHandler {
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}
  async execute(command: UpdateQuizQuestionCommand): Promise<boolean> {
    const { quizUpdateModel, id } = command;
    const updatedAt = new Date().toISOString();
    const isUpdatedQuestion = await this.quizQuestionsRepository.updateQuestion(
      quizUpdateModel,
      id,
      updatedAt,
    );
    if (!isUpdatedQuestion) {
      throw new NotFoundException();
    }
    return isUpdatedQuestion;
  }
}
