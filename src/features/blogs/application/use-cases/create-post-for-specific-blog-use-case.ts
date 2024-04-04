import { Types } from 'mongoose';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import {
  ExtendedLikesInfo,
  Posts,
  PostsDocument,
} from '../../../posts/domain/posts.entity';
import { PostCreateModel } from '../../../posts/api/models/input/create-post.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostForSpecificBlogCommand {
  constructor(
    public postCreateModel: PostCreateModel,
    public blogId: string,
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
  ): Promise<PostsDocument | null> {
    const { postCreateModel, blogId } = command;
    const isBlogExist = await this.blogsQueryRepository.getBlogById(
      Number(blogId),
    );
    if (!isBlogExist) {
      return null;
    }

    const { title, shortDescription, content } = postCreateModel;
    const createdAt = new Date().toISOString();

    const extendedLikesInfo = new ExtendedLikesInfo();
    extendedLikesInfo.likesCount = 0;
    extendedLikesInfo.dislikesCount = 0;
    extendedLikesInfo.myStatus = 'None';
    extendedLikesInfo.newestLikes = [];

    const newPost = new Posts();
    newPost.title = title;
    newPost.shortDescription = shortDescription;
    newPost.content = content;
    newPost.blogId = isBlogExist.id;
    newPost.blogName = isBlogExist.name;
    newPost.createdAt = createdAt;
    newPost.extendedLikesInfo = extendedLikesInfo;

    return this.postsRepository.createPost(newPost);
  }
}
