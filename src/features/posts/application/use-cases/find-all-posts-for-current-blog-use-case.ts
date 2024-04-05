import { Types } from 'mongoose';
import { SortingQueryParams } from '../../../blogs/api/models/query/query-for-sorting';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { AllPostsOutputModel } from '../../api/models/output/post-output.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { MyStatus } from '../../../likes/domain/likes.entity';
export class FindAllPostsForCurrentBlogCommand {
  constructor(
    public sortingQueryParams: SortingQueryParams,
    public blogId: number,
    public userId: string | null,
  ) {}
}
@CommandHandler(FindAllPostsForCurrentBlogCommand)
export class FindAllPostsForCurrentBlogUseCase
  implements ICommandHandler<FindAllPostsForCurrentBlogCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private likesRepository: LikesRepository,
  ) {}
  async execute(
    command: FindAllPostsForCurrentBlogCommand,
  ): Promise<AllPostsOutputModel | null> {
    const { sortingQueryParams, blogId, userId } = command;
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParams;

    const isBlogExist = await this.blogsQueryRepository.getBlogById(blogId);
    if (!isBlogExist) {
      return null;
    }
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.postsRepository.countAllDocumentsForCurrentBlog(blogId);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const allPosts = await this.postsRepository.getAllPostsForCurrentBlog(
      blogId,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );

    // if (userId === null) {
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
