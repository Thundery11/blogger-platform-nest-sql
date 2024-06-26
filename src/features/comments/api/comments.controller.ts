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
  ParseIntPipe,
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
  UpdateLikeForCommentsDto,
} from '../../likes/api/models/input/likes-input.model';
import { UpdateLikeStatusCommand } from '../application/use-cases/update-like-status-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Headers() headers,
  ) {
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
    @CurrentUserId() currentUserId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() content: CreateCommentInputModel,
  ): Promise<boolean> {
    const comment =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    if (Number(comment.commentatorInfo.userId) !== currentUserId) {
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
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUserId() currentUserId: number,
  ): Promise<boolean> {
    const comment =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    if (Number(comment.commentatorInfo.userId) !== currentUserId) {
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
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUserId() currentUserId: number,
    @Body() likeStatus: LikeStatus,
  ): Promise<boolean> {
    const updateLikeDto = new UpdateLikeForCommentsDto(
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
