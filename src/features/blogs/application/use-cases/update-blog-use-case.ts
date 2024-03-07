import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogCommand {
  constructor(
    public blogsUpdateModel: BlogsCreateModel,
    public id: string,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { blogsUpdateModel, id } = command;
    return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  }
}
