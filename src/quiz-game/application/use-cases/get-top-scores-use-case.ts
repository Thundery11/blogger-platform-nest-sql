import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParamsForTopScoreUsers } from '../../api/models/query/sorting-query-params-quiz';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';
import { parseSortParams } from '../../helper-functions/sorting-params-function';

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
  async execute(command: GetTopScoresCommand): Promise<any> {
    const { sortingQueryParamsForTopScoreUsers } = command;
    const {
      sort = ['sumScore desc', 'avgScores desc'],
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParamsForTopScoreUsers;
    const sortingParams = parseSortParams(sort);
    console.log('🚀 ~ QuizGameController ~ sortingParams:', sortingParams);
    console.log(
      '🚀 ~ QuizGameController ~ getTopScoreUsers ~ sortingQueryParamsForTopScoreUsers:',
      sortingQueryParamsForTopScoreUsers,
    );
  }
}