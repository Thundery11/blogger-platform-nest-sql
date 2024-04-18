import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from './models/output/post-output.model';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
  PostUpdateModel,
} from './models/input/create-post.input.model';
import { SortingQueryParamsForPosts } from './models/query/query-for-sorting';
import { Types } from 'mongoose';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { FindAllPostsCommand } from '../application/use-cases/find-all-posts-use-case';
import { CreatePostCommand } from '../application/use-cases/create-post-use-case';
import { UpdatePostCommand } from '../application/use-cases/update-post-use-case';
import { DeletePostCommand } from '../application/delete-post-use-case';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCommentInputModel } from '../../comments/api/models/input/comments-input.model';
import { CreateCommentForSpecificPostCommand } from '../../comments/application/use-cases/create-comment-for-specific-post-use-case';
import { CurrentUserId } from '../../auth/decorators/current-user-id-param.decorator';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { UserData } from '../../users/api/models/input/create-user.input.model';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CommentsOutputModel } from '../../comments/api/models/output/comments-model.output';
import { FindAllCommentsCommand } from '../application/use-cases/find-all-comments-use-case';
import { AuthService } from '../../auth/application/auth.service';
import {
  LikeStatus,
  UpdateLikeDto,
  UpdateLikeForPostsDto,
} from '../../likes/api/models/input/likes-input.model';
import { UpdateLikeStatusForPostsCommand } from '../application/use-cases/update-like-status-for-posts-use-case';
import { FindPostCommand } from '../application/use-cases/find-post-use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private authService: AuthService,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findPost(
    @Param('id', ParseIntPipe) postId: number,
    @Headers() headers,
  ): Promise<PostOutputModel | null> {
    if (!headers.authorization) {
      const userId = null;
      const post = await this.commandBus.execute(
        new FindPostCommand(userId, postId),
      );
      if (!post) {
        throw new NotFoundException();
      }
      return post;
    }
    const token = headers.authorization.split(' ')[1];
    const userId = await this.authService.getUserByToken(token);
    const post = await this.commandBus.execute(
      new FindPostCommand(userId, postId),
    );
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @Get()
  @HttpCode(200)
  async findAllPosts(
    @Query() sortingQueryPosts: SortingQueryParamsForPosts,
    @Headers() headers,
  ): Promise<AllPostsOutputModel | null> {
    let userId: number | null;
    if (!headers.authorization) {
      userId = null;
    } else {
      const token = headers.authorization.split(' ')[1];
      userId = await this.authService.getUserByToken(token);
    }
    const result = await this.commandBus.execute(
      new FindAllPostsCommand(sortingQueryPosts, userId),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  async findAllComments(
    @Query() sortingQueryParams: SortingQueryParamsForPosts,
    @Param('postId', ParseIntPipe) postId: number,
    @Headers() headers,
  ) {
    let userId: number | null;
    if (!headers.authorization) {
      userId = null;
    } else {
      const token = headers.authorization.split(' ')[1];
      userId = await this.authService.getUserByToken(token);
    }
    console.log('userId: ', userId);
    const allComments = await this.commandBus.execute(
      new FindAllCommentsCommand(sortingQueryParams, postId, userId),
    );
    if (!allComments) {
      throw new NotFoundException();
    }
    return allComments;
  }

  // @UseGuards(BasicAuthGuard)
  // @Post()
  // @HttpCode(201)
  // async createPost(
  //   @Body() postCreateModelWithBlogId: PostCreateModelWithBlogId,
  // ): Promise<PostOutputModel> {
  //   const result = await this.commandBus.execute(
  //     new CreatePostCommand(postCreateModelWithBlogId),
  //   );
  //   if (!result) {
  //     throw new NotFoundException();
  //   }
  //   return await this.postsQueryRepository.getPostById(result._id);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id')
  // @HttpCode(204)
  // async updatePost(
  //   @Param('id') id: string,
  //   @Body() postUpdateModel: PostUpdateModel,
  // ): Promise<boolean> {
  //   const result = await this.commandBus.execute(
  //     new UpdatePostCommand(postUpdateModel, id),
  //   );
  //   if (!result) {
  //     throw new NotFoundException();
  //   }
  //   return result;
  // }

  // @UseGuards(BasicAuthGuard)
  // @Delete(':id')
  // @HttpCode(204)
  // async deletePost(@Param('id') id: string): Promise<boolean> {
  //   const result = await this.commandBus.execute(new DeletePostCommand(id));
  //   if (!result) {
  //     throw new NotFoundException();
  //   }
  //   return result;
  // }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentForSpecificPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentModel: CreateCommentInputModel,
    @CurrentUserId() currentUserId,
  ): Promise<CommentsOutputModel | null> {
    const userId = currentUserId;
    const result = await this.commandBus.execute(
      new CreateCommentForSpecificPostCommand(
        createCommentModel,
        userId,
        postId,
      ),
    );
    const comment = await this.commentsQueryRepository.getCommentById(result);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeStatus(
    @CurrentUserId() currentUserId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() likeStatusModel: LikeStatus,
  ): Promise<boolean> {
    const updatePostLikesDto = new UpdateLikeForPostsDto(
      postId,
      currentUserId,
      likeStatusModel.likeStatus,
    );
    const updatedLikeStatus = await this.commandBus.execute(
      new UpdateLikeStatusForPostsCommand(updatePostLikesDto),
    );
    if (!updatedLikeStatus) {
      throw new NotFoundException();
    }

    return true;
  }
}
