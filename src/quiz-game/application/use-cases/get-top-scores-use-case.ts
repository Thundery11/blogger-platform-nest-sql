import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParamsForTopScoreUsers } from '../../api/models/query/sorting-query-params-quiz';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';

export class GetTopScoresCommand {
  constructor(
    public sortingQueryParamsForTopScoreUsers: SortingQueryParamsForTopScoreUsers,
  ) {}
}

@CommandHandler(GetTopScoresCommand)
export class GetTopScoresUseCase
  implements ICommandHandler<GetTopScoresCommand>
{
  constructor(private quizQueryRepository: QuizGameQueryRepository) {}
  async execute(command: GetTopScoresCommand): Promise<any> {}
}
