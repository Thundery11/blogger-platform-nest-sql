import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BlogsCreateModel } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users-query.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { ForbiddenException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Blogs } from '../../domain/blogs.entity';

export class UpdateBlogCommand {
  constructor(
    public currentUserId: number,
    public blogsUpdateModel: BlogsCreateModel,
    public id: number,
  ) {}
}
// @CommandHandler(UpdateBlogCommand)
// export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
//   constructor(
//     private blogsRepository: BlogsRepository,
//     private readonly blogsQueryRepository: BlogsQueryRepository,
//     private readonly eventBus: EventBus,
//     @InjectDataSource() private readonly dataSource: DataSource,
//   ) {}
//   async execute(command: UpdateBlogCommand): Promise<boolean> {
//     const { currentUserId, blogsUpdateModel, id } = command;
//     const findBlogToUpdate = await this.blogsQueryRepository.getBlogByUserId(
//       currentUserId,
//       id,
//     );

//     if (!findBlogToUpdate) {
//       throw new ForbiddenException();
//     }
//     const updatedBlog = findBlogToUpdate.updateBlog(blogsUpdateModel);
//     const blog = await this.blogsRepository.saveBlog(updatedBlog);

//     updatedBlog.getUncommittedEvents().forEach((e) => {
//       this.eventBus.publish(e);
//     });

//     if (!blog) return false;
//     return true;

//     // return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
//   }

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly eventBus: EventBus,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const onCommit = async (queryRunner: QueryRunner) => {
      const blogsRepositoryFromQR = queryRunner.manager.getRepository(Blogs);

      const { currentUserId, blogsUpdateModel, id } = command;
      const findBlogToUpdate = await blogsRepositoryFromQR
        .createQueryBuilder('blog')
        .select([
          'blog.id',
          'blog.name',
          'blog.description',
          'blog.websiteUrl',
          'blog.userId',
          'blog.createdAt',
          'blog.isMembership',
        ])
        .where(`blog.id = :id AND blog.userId = :currentUserId`, {
          id,
          currentUserId,
        })
        .getOne();
      // const findBlogToUpdate = await this.blogsQueryRepository.getBlogByUserId(
      //   currentUserId,
      //   id,
      // );
      if (!findBlogToUpdate) {
        throw new ForbiddenException();
      }
      const updatedBlog = findBlogToUpdate.updateBlog(blogsUpdateModel);
      const blog = await blogsRepositoryFromQR.save(updatedBlog);
      // const blog = await this.blogsRepository.saveBlog(updatedBlog);

      updatedBlog.getUncommittedEvents().forEach((e) => {
        this.eventBus.publish(e);
      });

      if (!blog) return false;
      await queryRunner.commitTransaction();
      return true;
    };
    const onError = (e) => {
      console.log({ e: e });
      throw new Error('Blog update transaction failed');
    };

    const res = await this.blogsRepository.handleTransaction(onCommit, onError);
    return res;
    // return await this.blogsRepository.updateBlog(id, blogsUpdateModel);
  }
}
