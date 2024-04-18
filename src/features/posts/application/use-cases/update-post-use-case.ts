import { PostUpdateModel } from '../../api/models/input/create-post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdatePostCommand {
  constructor(
    public postUpdateModel: PostUpdateModel,
    public blogId: number,
    public postId: number,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { blogId, postId, postUpdateModel } = command;
    const post = await this.postsRepository.getPostForBlogById(postId, blogId);

    return await this.postsRepository.updatePostForCurrentBlog(
      postId,
      blogId,
      postUpdateModel,
    );
  }
}
