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
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.quizQueryRepository.countAllDocumentsStatistic();
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const statistics = await this.quizQueryRepository.getTopStatistic(
      sort,
      pageSize,
      skip,
    );
    const presentationalStatistics = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: statistics,
    };
    return presentationalStatistics;
  }
}
