import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { ForbiddenException } from '@nestjs/common';
export class DeleteBlogCommand {
  constructor(
    public userId: number,
    public id: number,
  ) {}
}
@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const usersBlog = await this.blogsQueryRepository.getBlogByUserId(
      command.userId,
      command.id,
    );
    if (!usersBlog) {
      throw new ForbiddenException();
    }
    return await this.blogsRepository.deleteBlog(command.userId, command.id);
  }
}
