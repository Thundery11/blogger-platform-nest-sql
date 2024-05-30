import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParams } from '../../api/models/query/query-for-sorting';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  AllBlogsOutputModel,
  AllBlogsWithUserOutputModel,
} from '../../api/models/output/blog.output.model';

export class FindAllBlogsForCurrentUserCommand {
  constructor(
    public userId: number,
    public blogsQueryParams: SortingQueryParams,
  ) {}
}

@CommandHandler(FindAllBlogsForCurrentUserCommand)
export class FindAllBlogsForCurrentUserUseCase
  implements ICommandHandler<FindAllBlogsForCurrentUserCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(
    command: FindAllBlogsForCurrentUserCommand,
  ): Promise<AllBlogsOutputModel> {
    const searchNameTerm = command.blogsQueryParams.searchNameTerm ?? '';
    const sortBy = command.blogsQueryParams.sortBy ?? 'createdAt';
    const sortDirection = command.blogsQueryParams.sortDirection ?? 'desc';
    const pageNumber = command.blogsQueryParams.pageNumber ?? 1;
    const pageSize = command.blogsQueryParams.pageSize ?? 10;
    const userId = command.userId;

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.blogsRepository.countDocumentsForBlogOfCurrentUser(
        userId,
        searchNameTerm,
      );
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allBlogs = await this.blogsRepository.getAllBlogsForCurrentUser(
      userId,
      searchNameTerm,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationAllblogs = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allBlogs,
    };

    return presentationAllblogs;
  }
}
