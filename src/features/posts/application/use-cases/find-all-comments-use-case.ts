import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { SortingQueryParamsForPosts } from '../../api/models/query/query-for-sorting';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { PostsService } from '../posts.service';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { MyStatus } from '../../../likes/domain/likes.entity';
import { AllCommentsOutputModel } from '../../../comments/api/models/output/comments-model.output';
export class FindAllCommentsCommand {
  constructor(
    public sortingQueryParams: SortingQueryParamsForPosts,
    public postId: string,
    public userId: string | null,
  ) {}
}

@CommandHandler(FindAllCommentsCommand)
export class FindAllCommentsUseCase
  implements ICommandHandler<FindAllCommentsCommand>
{
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
    private postsService: PostsService,
  ) {}
  async execute(
    command: FindAllCommentsCommand,
  ): Promise<AllCommentsOutputModel | null> {
    const isExistPost = await this.postsQueryRepository.getPostById(
      new Types.ObjectId(command.postId),
    );
    if (!isExistPost) {
      throw new NotFoundException();
    }
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageSize = 10,
      pageNumber = 1,
    } = command.sortingQueryParams;
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.commentsRepository.countAllDocumentsForCurrentPost(
        command.postId,
      );
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const allComments = await this.commentsRepository.getComments(
      sortBy,
      sortDirection,
      pageSize,
      skip,
      command.postId,
    );

    if (command.userId === null) {
      const result = await Promise.all(
        allComments.map(
          async (comment) => (
            (comment.likesInfo.likesCount =
              await this.likesRepository.countLikes(comment.id.toString())),
            (comment.likesInfo.dislikesCount =
              await this.likesRepository.countDislikes(comment.id.toString())),
            (comment.likesInfo.myStatus = MyStatus.None)
          ),
        ),
      );
    } else if (typeof command.userId === 'string') {
      const result = await Promise.all(
        allComments.map(
          async (comment) => (
            (comment.likesInfo.myStatus =
              await this.likesRepository.whatIsMyStatus(
                command.userId!,
                comment.id,
              )),
            (comment.likesInfo.likesCount =
              await this.likesRepository.countLikes(comment.id.toString())),
            (comment.likesInfo.dislikesCount =
              await this.likesRepository.countDislikes(comment.id.toString()))
          ),
        ),
      );
    }
    const presentationalAllComments = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allComments,
    };

    return presentationalAllComments;
  }
}
