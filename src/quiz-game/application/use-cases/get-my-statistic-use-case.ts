import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';

export class GetMyStatisticCommand {
  constructor(public currentUserId: number) {}
}
@CommandHandler(GetMyStatisticCommand)
export class GetMyStatisticUseCase
  implements ICommandHandler<GetMyStatisticCommand>
{
  constructor(private quizGameQueryRepository: QuizGameQueryRepository) {}
  async execute(command: GetMyStatisticCommand): Promise<any> {
    const { currentUserId } = command;
    const totalScore =
      await this.quizGameQueryRepository.getTotalScore(currentUserId);
    return totalScore;
  }
}
