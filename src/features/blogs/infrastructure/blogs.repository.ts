import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model, Types } from 'mongoose';
import {
  BlogsOutputModel,
  allBlogsOutputMapper,
} from '../api/models/output/blog.output.model';
import {
  BlogsCreateDto,
  BlogsCreateModel,
} from '../api/models/input/create-blog.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  public async createBlog(blogsCreateDto: BlogsCreateDto) {
    const insertQuery = `INSERT INTO public."Blogs"("name", "description", "websiteUrl",
   "createdAt", "isMembership") VALUES ('${blogsCreateDto.name}', '${blogsCreateDto.description}', '${blogsCreateDto.websiteUrl}',
   '${blogsCreateDto.createdAt}', '${blogsCreateDto.isMembership}') RETURNING id`;
    const newBlog = await this.dataSource.query(insertQuery);
    const blogId = newBlog[0].id;
    return blogId;
  }

  public async countDocuments(searchNameTerm: string): Promise<number> {
    const selectQuery = `SELECT COUNT(*) FROM public."Blogs" b
   WHERE b."name" ILIKE $1;`;
    const result = await this.dataSource.query(selectQuery, [
      `%${searchNameTerm}%`,
    ]);
    console.log('🚀 ~ BlogsRepository ~ countDocuments ~ result:', result);
    const totalCount = Number(result[0].count);

    return totalCount;
  }

  public async getAllBlogs(
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<BlogsOutputModel[]> {
    const selectQuery = `SELECT 
    "id", "name", "description",
     "websiteUrl", "createdAt", "isMembership"
     FROM public."Blogs" b
     WHERE b."name" ILIKE $1
     ORDER BY b."${sortBy}" ${sortDirection}
     LIMIT ${pageSize} OFFSET ${skip};
     `;

    const blogs = await this.dataSource.query(selectQuery, [
      `%${searchNameTerm}%`,
    ]);
    return allBlogsOutputMapper(blogs);
  }

  public async updateBlog(
    id: number,
    blogsUpdateModel: BlogsCreateModel,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Blogs"
    SET "name" = '${blogsUpdateModel.name}', 
    "description" = '${blogsUpdateModel.description}',
    "websiteUrl" = '${blogsUpdateModel.websiteUrl}'
    WHERE "id"= $1;`,
      [id],
    );
    console.log('🚀 ~ BlogsRepository ~ result:', result);

    return result[1] === 1 ? true : false;
  }

  public async deleteBlog(id: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Blogs"
    WHERE "id" = $1
    RETURNING "id";`,
      [id],
    );
    return result[1] === 1 ? true : false;
  }
}
