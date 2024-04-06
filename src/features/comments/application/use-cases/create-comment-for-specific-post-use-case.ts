import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateCommentDto,
  CreateCommentInputModel,
} from '../../api/models/input/comments-input.model';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentForSpecificPostCommand {
  constructor(
    public createCommentModel: CreateCommentInputModel,
    public userId: number,
    public postId: number,
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
  ): Promise<number | null> {
    const { userId, postId, createCommentModel } = command;
    const isPostExist = await this.postsRepository.getPostById(postId);
    if (!isPostExist) {
      return null;
    }
    const createdAt = new Date().toISOString();
    const createCommentDto = new CreateCommentDto(
      userId,
      postId,
      createdAt,
      createCommentModel.content,
    );

    return this.commentsRepository.createComment(createCommentDto);
  }
}
