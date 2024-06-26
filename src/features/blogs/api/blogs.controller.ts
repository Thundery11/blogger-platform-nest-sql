import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
import { BlogsCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import {
  AllBlogsOutputModel,
  BlogsOutputModel,
} from './models/output/blog.output.model';
import { SortingQueryParams } from './models/query/query-for-sorting';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { PostCreateModel } from '../../posts/api/models/input/create-post.input.model';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from '../../posts/api/models/output/post-output.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog-use-case';
import { FindAllBlogsCommand } from '../application/use-cases/find-all-blogs-use-case';
import { UpdateBlogCommand } from '../application/use-cases/update-blog-use-case';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog-use-case';
import { CreatePostForSpecificBlogCommand } from '../application/use-cases/create-post-for-specific-blog-use-case';
import { FindAllPostsForCurrentBlogCommand } from '../../posts/application/use-cases/find-all-posts-for-current-blog-use-case';
import { AuthService } from '../../auth/application/auth.service';

@ApiTags('Blogs')
// @UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private authService: AuthService,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogsOutputModel> {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  @Get()
  @HttpCode(200)
  async findAllBlogs(
    @Query() blogsQueryParams: SortingQueryParams,
  ): Promise<AllBlogsOutputModel> {
    return await this.commandBus.execute(
      new FindAllBlogsCommand(blogsQueryParams),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForSpecificBlog(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() postCreateModel: PostCreateModel,
  ): Promise<PostOutputModel | null> {
    const result = await this.commandBus.execute(
      new CreatePostForSpecificBlogCommand(postCreateModel, blogId),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return await this.postsQueryRepository.getPostById(result._id);
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async findAllPostsforScpecificBlog(
    @Headers() headers,
    @Param('blogId', ParseIntPipe) blogid: number,
    @Query() sortingQueryParams: SortingQueryParams,
  ): Promise<AllPostsOutputModel | null> {
    let userId: number | null;
    if (!headers.authorization) {
      userId = null;
    } else {
      const token = headers.authorization.split(' ')[1];
      userId = await this.authService.getUserByToken(token);
    }
    const result = await this.commandBus.execute(
      new FindAllPostsForCurrentBlogCommand(sortingQueryParams, blogid, userId),
    );
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }
}
