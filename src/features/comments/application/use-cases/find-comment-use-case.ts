import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesService } from '../../../likes/application/likes.service';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { MyStatus } from '../../../likes/domain/likes.entity';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';
import { Types } from 'mongoose';
import { CommentsOutputModel } from '../../api/models/output/comments-model.output';

export class FindCommentCommand {
  constructor(
    public userId: string | null,
    public commentId: string,
  ) {}
}
@CommandHandler(FindCommentCommand)
export class FindCommentUseCase implements ICommandHandler<FindCommentCommand> {
  constructor(
    private likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute(
    command: FindCommentCommand,
  ): Promise<CommentsOutputModel | null> {
    const dislikesCount = await this.likesRepository.countDislikes(
      command.commentId,
    );
    const likesCount = await this.likesRepository.countLikes(command.commentId);
    const comment = await this.commentsQueryRepository.getCommentById(
      new Types.ObjectId(command.commentId),
    );
    const reaction = command.userId
      ? await this.likesRepository.whatIsMyStatus(
          command.userId,
          command.commentId,
        )
      : MyStatus.None;

    if (!comment) return null;

    comment.likesInfo.dislikesCount = dislikesCount;
    comment.likesInfo.likesCount = likesCount;
    if (reaction === MyStatus.None) {
      comment.likesInfo.myStatus = MyStatus.None;
    } else {
      comment.likesInfo.myStatus = reaction;
    }
    return comment;
  }
}
