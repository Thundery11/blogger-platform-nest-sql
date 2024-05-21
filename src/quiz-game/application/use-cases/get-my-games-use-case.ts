import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParamsForQuizGame } from '../../api/models/query/sorting-query-params-quiz';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';

export class GetMyGamesCommand {
  constructor(
    public sortingQueryParamsForQuiz: SortingQueryParamsForQuizGame,
    public currentUserId: number,
  ) {}
}

@CommandHandler(GetMyGamesCommand)
export class GetMyGamesUseCase implements ICommandHandler<GetMyGamesCommand> {
  constructor(private quizGameQueryRepository: QuizGameQueryRepository) {}
  async execute(command: GetMyGamesCommand): Promise<any> {
    const { sortingQueryParamsForQuiz, currentUserId } = command;
    const {
      sortBy = 'pairCreatedDate',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParamsForQuiz;
    console.log('🚀 ~ GetMyGamesUseCase ~ execute ~ sortBy:', sortBy);

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.quizGameQueryRepository.countAllDocuments(currentUserId);

    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const myGames = await this.quizGameQueryRepository.findMyGames(
      sortBy,
      sortDirection,
      pageSize,
      skip,
      currentUserId,
    );

    const presentationalAllQuizGames = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: myGames,
    };
    return presentationalAllQuizGames;
  }
}
