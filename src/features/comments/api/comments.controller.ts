import {
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  Request,
  Headers,
  Put,
  UseGuards,
  ForbiddenException,
  Body,
  Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LikesService } from '../../likes/application/likes.service';
import { FindCommentCommand } from '../application/use-cases/find-comment-use-case';
import { CommentsOutputModel } from './models/output/comments-model.output';
import { AuthService } from '../../auth/application/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id-param.decorator';
import { CreateCommentInputModel } from './models/input/comments-input.model';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { Types } from 'mongoose';
import { UpdateCommentCommand } from '../application/use-cases/update-comment-use-case';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment-use-case';
import {
  LikeStatus,
  UpdateLikeDto,
} from '../../likes/api/models/input/likes-input.model';
import { UpdateLikeStatusCommand } from '../application/use-cases/update-like-status-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private likesService: LikesService,
    private authService: AuthService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findComment(@Param('id') commentId: string, @Headers() headers) {
    if (!headers.authorization) {
      const userId = null;
      const comment: CommentsOutputModel | null = await this.commandBus.execute(
        new FindCommentCommand(userId, commentId),
      );
      if (!comment) {
        throw new NotFoundException();
      }
      return comment;
    }
    const token = headers.authorization.split(' ')[1];
    const userId = await this.authService.getUserByToken(token);

    const comment: CommentsOutputModel | null = await this.commandBus.execute(
      new FindCommentCommand(userId, commentId),
    );
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @CurrentUserId() currentUserId: string,
    @Param('commentId') commentId: string,
    @Body() content: CreateCommentInputModel,
  ) {
    const comment = await this.commentsQueryRepository.getCommentById(
      new Types.ObjectId(commentId),
    );
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.commentatorInfo.userId !== currentUserId) {
      throw new ForbiddenException();
    }
    const result = await this.commandBus.execute(
      new UpdateCommentCommand(content, commentId),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUserId() currentUserId: string,
  ): Promise<boolean> {
    const comment = await this.commentsQueryRepository.getCommentById(
      new Types.ObjectId(commentId),
    );
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.commentatorInfo.userId !== currentUserId) {
      throw new ForbiddenException();
    }
    const result = await this.commandBus.execute(
      new DeleteCommentCommand(commentId),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @CurrentUserId() currentUserId: string,
    @Body() likeStatus: LikeStatus,
  ): Promise<boolean> {
    const updateLikeDto = new UpdateLikeDto(
      commentId,
      currentUserId,
      likeStatus.likeStatus,
    );
    const updatedLikeStatus = await this.commandBus.execute(
      new UpdateLikeStatusCommand(updateLikeDto),
    );
    if (!updatedLikeStatus) {
      throw new NotFoundException();
    }
    return true;
  }
}
