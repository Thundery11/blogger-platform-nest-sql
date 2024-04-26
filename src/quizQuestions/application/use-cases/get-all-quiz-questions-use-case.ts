import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParamsForQuiz } from '../../api/models/input/quiz-questions.input.model';
import { QuizQuestionsRepository } from '../../api/infrastructure/quiz-questions.repository';
import { QuizQuestionsQueryRepository } from '../../api/infrastructure/quiz-questions.query.repository';

export class FindAllQuestionsCommand {
  constructor(public sortingQueryParamsForQuiz: SortingQueryParamsForQuiz) {}
}

@CommandHandler(FindAllQuestionsCommand)
export class FindAllQuestionsUseCase implements ICommandHandler {
  constructor(
    private quizQuestionsRepository: QuizQuestionsRepository,
    private quizQueryRepo: QuizQuestionsQueryRepository,
  ) {}
  async execute(command: FindAllQuestionsCommand): Promise<any> {
    const { sortingQueryParamsForQuiz } = command;
    const {
      bodySearchTerm = '',
      publishedStatus = 'all',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParamsForQuiz;

    let sortingByPublish;

    switch (publishedStatus) {
      case 'all':
        sortingByPublish = null;
        break;
      case 'published':
        sortingByPublish = true;
        break;
      case 'notPublished':
        sortingByPublish = false;
        break;
    }
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.quizQuestionsRepository.countDocuments(
      bodySearchTerm,
      sortingByPublish,
    );
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const allQuestions = await this.quizQueryRepo.getAllQuestions(
      bodySearchTerm,
      sortingByPublish,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationAllQuestions = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allQuestions,
    };
    return presentationAllQuestions;
  }
}
