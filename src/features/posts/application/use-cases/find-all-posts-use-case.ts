import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParams } from '../../../blogs/api/models/query/query-for-sorting';
import { AllPostsOutputModel } from '../../api/models/output/post-output.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { MyStatus } from '../../../likes/domain/likes.entity';

export class FindAllPostsCommand {
  constructor(
    public sortingQueryParams: SortingQueryParams,
    public userId: string | null,
  ) {}
}

@CommandHandler(FindAllPostsCommand)
export class FindAllPostsUseCase
  implements ICommandHandler<FindAllPostsCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}
  async execute(command: FindAllPostsCommand): Promise<AllPostsOutputModel> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = command.sortingQueryParams;
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.postsRepository.countAllDocuments();
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const allPosts = await this.postsRepository.getAllPosts(
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    // if (command.userId === null) {
    //   const result = await Promise.all(
    //     allPosts.map(
    //       async (post) => (
    //         (post.extendedLikesInfo.likesCount =
    //           await this.likesRepository.countLikes(post.id.toString())),
    //         (post.extendedLikesInfo.dislikesCount =
    //           await this.likesRepository.countDislikes(post.id.toString())),
    //         (post.extendedLikesInfo.myStatus = MyStatus.None),
    //         (post.extendedLikesInfo.newestLikes =
    //           await this.likesRepository.getLastLikes(post.id))
    //       ),
    //     ),
    //   );
    // } else if (typeof command.userId === 'string') {
    //   const result = await Promise.all(
    //     allPosts.map(
    //       async (post) => (
    //         (post.extendedLikesInfo.likesCount =
    //           await this.likesRepository.countLikes(post.id.toString())),
    //         (post.extendedLikesInfo.dislikesCount =
    //           await this.likesRepository.countDislikes(post.id.toString())),
    //         (post.extendedLikesInfo.myStatus =
    //           await this.likesRepository.whatIsMyStatus(
    //             command.userId!,
    //             post.id,
    //           )),
    //         (post.extendedLikesInfo.newestLikes =
    //           await this.likesRepository.getLastLikes(post.id))
    //       ),
    //     ),
    //   );
    // }

    const presentationalAllPosts = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allPosts,
    };

    return presentationalAllPosts;
  }
}
