import { Types } from 'mongoose';
import { PostUpdateModel } from '../../api/models/input/create-post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdatePostCommand {
  constructor(
    public postUpdateModel: PostUpdateModel,
    public id: string,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: UpdatePostCommand): Promise<boolean> {
    const post = await this.postsRepository.getPostById(
      new Types.ObjectId(command.id),
    );
    post.updatePost(command.postUpdateModel);
    await this.postsRepository.save(post);
    return true;
  }
}
