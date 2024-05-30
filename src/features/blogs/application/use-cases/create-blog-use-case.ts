import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import { Blogs } from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BlogsOutputModel } from '../../api/models/output/blog.output.model';

export class CreateBlogCommand {
  constructor(
    public userId: number,
    public blogsCreateModel: BlogsCreateModel,
  ) {}
}
@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogsOutputModel> {
    const newBlog = Blogs.createBlog(command.userId, command.blogsCreateModel);

    const createdBlog = await this.blogsRepository.saveBlog(newBlog);
    newBlog.getUncommittedEvents().forEach((e) => {
      this.eventBus.publish(e);
    });
    return createdBlog;
  }
}
