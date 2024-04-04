import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model, Types } from 'mongoose';
import {
  BlogsOutputMapper,
  BlogsOutputModel,
} from '../api/models/output/blog.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Blogs.name) private blogsModel: Model<Blogs>,
  ) {}
  public async getBlogById(blogId: number): Promise<BlogsOutputModel | null> {
    const blog = await this.dataSource.query(
      `SELECT 
    "id", "name", "description",
     "websiteUrl", "createdAt", "isMembership"
     FROM public."Blogs" WHERE "id" = $1;`,
      [blogId],
    );

    if (!blog) {
      return null;
    }
    return BlogsOutputMapper(blog);
  }
}
