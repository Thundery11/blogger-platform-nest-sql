import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repository';
export class DeletePostCommand {
  constructor(
    public blogId: number,
    public postId: number,
  ) {}
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { blogId, postId } = command;
    return await this.postsRepository.deletePost(blogId, postId);
  }
}
