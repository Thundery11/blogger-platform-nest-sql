import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { PostOutputModel } from '../../api/models/output/post-output.model';
import { Types } from 'mongoose';
import { MyStatus } from '../../../likes/domain/likes.entity';

export class FindPostCommand {
  constructor(
    public userId: number | null,
    public postId: number,
  ) {}
}
@CommandHandler(FindPostCommand)
export class FindPostUseCase implements ICommandHandler<FindPostCommand> {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private likesRepository: LikesRepository,
  ) {}
  async execute(command: FindPostCommand): Promise<PostOutputModel | null> {
    const likesCount = await this.likesRepository.countLikes(command.postId);
    const dislikesCount = await this.likesRepository.countDislikes(
      command.postId,
    );

    const post = await this.postsQueryRepository.getPostById(
      Number(command.postId),
    );
    if (!post) {
      return null;
    }
    const reaction = command.userId
      ? await this.likesRepository.whatIsMyStatus(
          command.userId,
          command.postId,
        )
      : MyStatus.None;
    const lastLiked = await this.likesRepository.getLastLikes(
      Number(command.postId),
    );

    post.extendedLikesInfo.dislikesCount = dislikesCount;
    post.extendedLikesInfo.likesCount = likesCount;
    if (reaction === MyStatus.None) {
      post.extendedLikesInfo.myStatus = MyStatus.None;
    } else {
      post.extendedLikesInfo.myStatus = reaction;
    }
    post.extendedLikesInfo.newestLikes = lastLiked;

    return post;
  }
}
