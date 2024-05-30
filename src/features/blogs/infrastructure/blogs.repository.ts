import { Injectable } from '@nestjs/common';
import { Blogs } from '../domain/blogs.entity';
import {
  AllBlogsOutputModel,
  BlogsOutputMapper,
  BlogsOutputModel,
  allBlogsOutputMapper,
} from '../api/models/output/blog.output.model';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blogs) private blogsRepository: Repository<Blogs>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  public async saveBlog(newBlog: Blogs): Promise<BlogsOutputModel> {
    try {
      const blog = await this.blogsRepository.save(newBlog);
      return BlogsOutputMapper(blog);
    } catch (e) {
      console.error(e);
      {
        throw e;
      }
    }

    //   const insertQuery = `INSERT INTO public."Blogs"("name", "description", "websiteUrl",
    //  "createdAt", "isMembership") VALUES ('${blogsCreateDto.name}', '${blogsCreateDto.description}', '${blogsCreateDto.websiteUrl}',
    //  '${blogsCreateDto.createdAt}', '${blogsCreateDto.isMembership}') RETURNING id`;
    //   const newBlog = await this.dataSource.query(insertQuery);
    //   const blogId = newBlog[0].id;
    //   return blogId;
  }

  public async handleTransaction(
    onCommit: (queryRunner: QueryRunner) => any,
    onError: (e: Error) => any,
    onFinally?: () => any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const queryRes = await onCommit(queryRunner);

      console.log(1);
      return queryRes;
    } catch (e) {
      console.log(2);
      await queryRunner.rollbackTransaction();

      await onError(e);
      return false;
    } finally {
      console.log(3);
      await onFinally?.();
      await queryRunner.release();
    }
  }

  public async countDocuments(searchNameTerm: string): Promise<number> {
    try {
      const count = await this.blogsRepository
        .createQueryBuilder('b')
        .select('b')
        .where('b.name ILIKE :name', { name: `%${searchNameTerm}%` })
        .getCount();
      return count;
    } catch (e) {
      console.error(e);
      throw e;
    }

    //   const selectQuery = `SELECT COUNT(*) FROM public."blogs" b
    // //  WHERE b."name" ILIKE $1;`;
    //   const result = await this.dataSource.query(selectQuery, [
    //     `%${searchNameTerm}%`,
    //   ]);
    //   console.log('🚀 ~ BlogsRepository ~ countDocuments ~ result:', result);
    //   const totalCount = Number(result[0].count);
  }

  public async getAllBlogs(
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<BlogsOutputModel[]> {
    try {
      const blogs = await this.blogsRepository
        .createQueryBuilder('b')
        .select('b')
        .where('b.name ILIKE :searchNameTerm', {
          searchNameTerm: `%${searchNameTerm}%`,
        })
        .orderBy(`b.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
        .skip(skip)
        .take(pageSize)
        .getMany();
      return allBlogsOutputMapper(blogs);
    } catch (e) {
      console.error(e);
      throw e;
    }

    // const selectQuery = `SELECT
    // "id", "name", "description",
    //  "websiteUrl", "createdAt", "isMembership"
    //  FROM public."Blogs" b
    //  WHERE b."name" ILIKE $1
    //  ORDER BY b."${sortBy}" ${sortDirection}
    //  LIMIT ${pageSize} OFFSET ${skip};
    //  `;

    // const blogs = await this.dataSource.query(selectQuery, [
    //   `%${searchNameTerm}%`,
    // ]);
    // return allBlogsOutputMapper(blogs);
  }

  public async updateBlog(
    id: number,
    blogsUpdateModel: BlogsCreateModel,
  ): Promise<boolean> {
    try {
      const res = await this.blogsRepository.update(
        { id: id },
        {
          description: blogsUpdateModel.description,
          websiteUrl: blogsUpdateModel.websiteUrl,
          name: blogsUpdateModel.name,
        },
      );
      return res.affected === 1 ? true : false;
    } catch (e) {
      console.error(e);
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `UPDATE public."Blogs"
    // SET "name" = '${blogsUpdateModel.name}',
    // "description" = '${blogsUpdateModel.description}',
    // "websiteUrl" = '${blogsUpdateModel.websiteUrl}'
    // WHERE "id"= $1;`,
    //   [id],
    // );
    // console.log('🚀 ~ BlogsRepository ~ result:', result);

    // return result[1] === 1 ? true : false;
  }

  public async deleteBlog(userId: number, id: number): Promise<boolean> {
    try {
      const result = await this.blogsRepository.delete({
        userId: userId,
        id: id,
      });
      return result.affected === 1;
    } catch (e) {
      console.error(e);
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `DELETE FROM public."Blogs"
    // WHERE "id" = $1
    // RETURNING "id";`,
    //   [id],
    // );
    // return result[1] === 1 ? true : false;
  }
}
