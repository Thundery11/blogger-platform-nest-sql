import { Types } from 'mongoose';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostCreateModelWithBlogId } from '../../api/models/input/create-post.input.model';
import {
  CreatePostDto,
  ExtendedLikesInfo,
  Posts,
  PostsDocument,
} from '../../domain/posts.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostCommand {
  constructor(public postCreateModelWithBlogId: PostCreateModelWithBlogId) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}
  async execute(command: CreatePostCommand): Promise<number | null> {
    const { title, shortDescription, content, blogId } =
      command.postCreateModelWithBlogId;

    const isBlogExist = await this.blogsQueryRepository.getBlogById(
      Number(blogId),
    );
    if (!isBlogExist) {
      return null;
    }

    const createdAt = new Date().toISOString();
    const extendedLikesInfo = new ExtendedLikesInfo();
    extendedLikesInfo.likesCount = 0;
    extendedLikesInfo.dislikesCount = 0;
    extendedLikesInfo.myStatus = 'None';
    extendedLikesInfo.newestLikes = [];

    const newPost = new CreatePostDto(
      title,
      shortDescription,
      content,
      Number(isBlogExist.id),
      isBlogExist.name,
      createdAt,
    );

    return this.postsRepository.createPost(newPost);
  }
}
