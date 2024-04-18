import { Types } from 'mongoose';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import {
  CreatePostDto,
  ExtendedLikesInfo,
  ExtendedLikesInfoo,
  Posts,
  PostsDocument,
} from '../../../posts/domain/posts.entity';
import { PostCreateModel } from '../../../posts/api/models/input/create-post.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostForSpecificBlogCommand {
  constructor(
    public postCreateModel: PostCreateModel,
    public blogId: number,
  ) {}
}
@CommandHandler(CreatePostForSpecificBlogCommand)
export class CreatePostForSpecificBlogUseCase
  implements ICommandHandler<CreatePostForSpecificBlogCommand>
{
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}
  async execute(
    command: CreatePostForSpecificBlogCommand,
  ): Promise<Posts | null> {
    const { postCreateModel, blogId } = command;
    const isBlogExist = await this.blogsQueryRepository.getBlogById(blogId);
    console.log('🚀 ~ isBlogExist:', isBlogExist);
    if (!isBlogExist) {
      return null;
    }

    const { title, shortDescription, content } = postCreateModel;
    const createdAt = new Date().toISOString();

    const newPost = new Posts();
    newPost.title = title;
    newPost.shortDescription = shortDescription;
    newPost.content = content;
    newPost.blogId = Number(isBlogExist.id);
    newPost.createdAt = createdAt;

    return this.postsRepository.createPost(newPost);
  }
}
