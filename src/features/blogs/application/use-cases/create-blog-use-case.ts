import { InjectModel } from '@nestjs/mongoose';
import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import {
  Blogs,
  BlogsDocument,
  BlogsModelType,
} from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateBlogCommand {
  constructor(public blogsCreateModel: BlogsCreateModel) {}
}
@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blogs.name) private blogsModel: BlogsModelType,
  ) {}

  async execute(command: CreateBlogCommand): Promise<BlogsDocument> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    const newBlog = this.blogsModel.createBlog(
      command.blogsCreateModel,
      createdAt,
      isMembership,
    );

    return await this.blogsRepository.createBlog(newBlog);
  }
}
