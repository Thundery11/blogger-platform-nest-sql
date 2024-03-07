import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../../likes/api/models/input/likes-input.model';
import { LikesService } from '../../../likes/application/likes.service';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class UpdateLikeStatusCommand {
  constructor(public updateLikeDto: UpdateLikeDto) {}
}
@CommandHandler(UpdateLikeStatusCommand)
export class UpdateCommentsLikeStatusUseCase
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(
    private likesService: LikesService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute(command: UpdateLikeStatusCommand): Promise<any> {
    const comment = await this.commentsQueryRepository.getCommentById(
      new Types.ObjectId(command.updateLikeDto.commentId),
    );
    if (!comment) {
      throw new NotFoundException();
    }
    const isLikeExist = await this.likesService.isLikeExist(
      command.updateLikeDto.currentUserId,
      command.updateLikeDto.commentId,
    );
    if (!isLikeExist) {
      return await this.likesService.addLike(
        command.updateLikeDto.currentUserId,
        command.updateLikeDto.commentId,
        command.updateLikeDto.likeStatus,
      );
    }
    const result = await this.likesService.updateLike(
      command.updateLikeDto.currentUserId,
      command.updateLikeDto.commentId,
      command.updateLikeDto.likeStatus,
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
