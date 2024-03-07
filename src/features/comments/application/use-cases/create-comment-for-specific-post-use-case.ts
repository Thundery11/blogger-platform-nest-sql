import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentInputModel } from '../../api/models/input/comments-input.model';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { Types } from 'mongoose';
import { UserData } from '../../../users/api/models/input/create-user.input.model';
import {
  CommentatorInfo,
  Comments,
  CommentsDocument,
  LikesInfo,
} from '../../domain/comments.entity';
import { MyStatus } from '../../../likes/domain/likes.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentForSpecificPostCommand {
  constructor(
    public createCommentModel: CreateCommentInputModel,
    public userData: UserData,
    public postId: string,
  ) {}
}

@CommandHandler(CreateCommentForSpecificPostCommand)
export class CreateCommentForSpecificPostUseCase
  implements ICommandHandler<CreateCommentForSpecificPostCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(
    command: CreateCommentForSpecificPostCommand,
  ): Promise<CommentsDocument | null> {
    const isPostExist = await this.postsRepository.getPostById(
      new Types.ObjectId(command.postId),
    );
    if (!isPostExist) {
      return null;
    }
    const createdAt = new Date().toISOString();
    const likesInfo = new LikesInfo();
    likesInfo.likesCount = 0;
    likesInfo.dislikesCount = 0;
    likesInfo.myStatus = MyStatus.None;

    const commentatorInfo = new CommentatorInfo();
    commentatorInfo.userId = command.userData.userId;
    commentatorInfo.userLogin = command.userData.userLogin;

    const newComment = new Comments();
    newComment.postId = command.postId;
    newComment.content = command.createCommentModel.content;
    newComment.commentatorInfo = commentatorInfo;
    newComment.createdAt = createdAt;
    newComment.likesInfo = likesInfo;

    return this.commentsRepository.createComment(newComment);
  }
}
