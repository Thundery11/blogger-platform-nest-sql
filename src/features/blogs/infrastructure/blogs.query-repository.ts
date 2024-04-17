import { Injectable } from '@nestjs/common';
import { Blogs } from '../domain/blogs.entity';
import {
  BlogsOutputMapper,
  BlogsOutputModel,
} from '../api/models/output/blog.output.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blogs) private blogsRepository: Repository<Blogs>,
  ) {}
  public async getBlogById(blogId: number): Promise<BlogsOutputModel | null> {
    try {
      const blog = await this.blogsRepository.findOneBy({ id: blogId });
      if (!blog) return null;
      return BlogsOutputMapper(blog);
    } catch (e) {
      console.error(e);
      {
        throw e;
      }
    }
    // const blog = await this.dataSource.query(
    //   `SELECT
    // "id", "name", "description",
    //  "websiteUrl", "createdAt", "isMembership"
    //  FROM public."Blogs" WHERE "id" = $1;`,
    //   [blogId],
    // );

    // if (!blog) {
    //   return null;
    // }
    // return BlogsOutputMapper(blog);
  }
}
