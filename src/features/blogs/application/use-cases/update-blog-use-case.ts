import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users-query.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { ForbiddenException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class UpdateBlogCommand {
  constructor(
    public currentUserId: number,
    public blogsUpdateModel: BlogsCreateModel,
    public id: number,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly eventBus: EventBus,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { currentUserId, blogsUpdateModel, id } = command;
    const findBlogToUpdate = await this.blogsQueryRepository.getBlogByUserId(
      currentUserId,
      id,
    );

    if (!findBlogToUpdate) {
      throw new ForbiddenException();
    }
    const updatedBlog = findBlogToUpdate.updateBlog(blogsUpdateModel);
    const blog = await this.blogsRepository.saveBlog(updatedBlog);

    updatedBlog.getUncommittedEvents().forEach((e) => {
      this.eventBus.publish(e);
    });

    if (!blog) return false;
    return true;

    // return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  }

  // async execute(command: UpdateBlogCommand): Promise<boolean> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const blogQueryRepoFromQR =
  //       queryRunner.manager.getRepository(BlogsQueryRepository);
  //     const blogsRepositoryFromQR =
  //       queryRunner.manager.getRepository(BlogsRepository);

  //     const { currentUserId, blogsUpdateModel, id } = command;
  //     const findBlogToUpdate = await this.blogsQueryRepository.getBlogByUserId(
  //       currentUserId,
  //       id,
  //     );

  //     if (!findBlogToUpdate) {
  //       throw new ForbiddenException();
  //     }
  //     const updatedBlog = findBlogToUpdate.updateBlog(blogsUpdateModel);
  //     const blog = blogsRepositoryFromQR.save(updatedBlog);
  //     // const blog = await this.blogsRepository.saveBlog(updatedBlog);

  //     updatedBlog.getUncommittedEvents().forEach((e) => {
  //       this.eventBus.publish(e);
  //     });

  //     if (!blog) return false;
  //     await queryRunner.commitTransaction();

  //     return true;
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     console.log({ e: e });
  //     throw new Error('Blog update transaction failed');
  //   } finally {
  //     await queryRunner.release();
  //   }
  //   // return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  // }
}
