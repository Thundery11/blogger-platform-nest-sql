import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AllBlogsOutputModel,
  AllBlogsWithUserOutputModel,
} from '../../api/models/output/blog.output.model';
import { SortingQueryParams } from '../../api/models/query/query-for-sorting';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class FindAllBlogsCommand {
  constructor(public blogsQueryParams: SortingQueryParams) {}
}

@CommandHandler(FindAllBlogsCommand)
export class FindAllBlogsUseCase
  implements ICommandHandler<FindAllBlogsCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(
    command: FindAllBlogsCommand,
  ): Promise<AllBlogsWithUserOutputModel> {
    const searchNameTerm = command.blogsQueryParams.searchNameTerm ?? '';
    const sortBy = command.blogsQueryParams.sortBy ?? 'createdAt';
    const sortDirection = command.blogsQueryParams.sortDirection ?? 'desc';
    const pageNumber = command.blogsQueryParams.pageNumber ?? 1;
    const pageSize = command.blogsQueryParams.pageSize ?? 10;

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.blogsRepository.countDocuments(searchNameTerm);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allBlogs = await this.blogsRepository.getAllBlogsWithUser(
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
