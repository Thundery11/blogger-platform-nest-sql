import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import { Blogs } from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsOutputModel } from '../../api/models/output/blog.output.model';

export class CreateBlogCommand {
  constructor(public blogsCreateModel: BlogsCreateModel) {}
}
@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<BlogsOutputModel> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const newBlog = new Blogs();
    newBlog.description = command.blogsCreateModel.description;
    newBlog.websiteUrl = command.blogsCreateModel.websiteUrl;
    newBlog.name = command.blogsCreateModel.name;
    newBlog.createdAt = createdAt;
    newBlog.isMembership = isMembership;

    return await this.blogsRepository.createBlog(newBlog);
  }
}
