import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentInputModel } from '../../api/models/input/comments-input.model';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { Types } from 'mongoose';
import { CommentsDocument } from '../../domain/comments.entity';
export class UpdateCommentCommand {
  constructor(
    public content: CreateCommentInputModel,
    public commentId: number,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentCommand): Promise<boolean> {
    return await this.commentsRepository.updateComment(
      command.content,
      command.commentId,
    );
  }
}
