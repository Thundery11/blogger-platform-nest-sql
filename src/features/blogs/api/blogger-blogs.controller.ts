import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BlogsCreateModel } from './models/input/create-blog.input.model';
import { BlogsOutputModel } from './models/output/blog.output.model';
import { CreateBlogCommand } from '../application/use-cases/create-blog-use-case';
import { CurrentUserId } from '../../auth/decorators/current-user-id-param.decorator';
import { UpdateBlogCommand } from '../application/use-cases/update-blog-use-case';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog-use-case';
import { SortingQueryParams } from './models/query/query-for-sorting';
import { FindAllBlogsForCurrentUserCommand } from '../application/use-cases/find-all-blogs-for-current-user-use-case';

@Controller('/blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() blogsCreateModel: BlogsCreateModel,
    @CurrentUserId() currentUserID: number,
  ): Promise<BlogsOutputModel> {
    const blog = await this.commandBus.execute(
      new CreateBlogCommand(currentUserID, blogsCreateModel),
    );
    // const blog = await this.blogsQueryRepository.getBlogById(blogId);
    // if (!blog) {
    //   throw new NotFoundException();
    // }
    return blog;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() blogsUpdateModel: BlogsCreateModel,
    @CurrentUserId() currentUserId: number,
  ): Promise<boolean> {
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(currentUserId, blogsUpdateModel, id),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() userId: number,
  ): Promise<boolean> {
    const result = await this.commandBus.execute(
      new DeleteBlogCommand(userId, id),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query() blogsQueryParams: SortingQueryParams,
    @CurrentUserId() userId: number,
  ) {
    return await this.commandBus.execute(
      new FindAllBlogsForCurrentUserCommand(userId, blogsQueryParams),
    );
  }
}
