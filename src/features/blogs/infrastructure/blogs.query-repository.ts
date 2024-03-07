import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model, Types } from 'mongoose';
import {
  BlogsOutputMapper,
  BlogsOutputModel,
} from '../api/models/output/blog.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private blogsModel: Model<Blogs>) {}
  public async getBlogById(
    blogId: Types.ObjectId,
  ): Promise<BlogsOutputModel | null> {
    const blog = await this.blogsModel.findById(blogId, {
      _v: false,
    });
    if (!blog) {
      // throw new NotFoundException();
      return null;
    }
    return BlogsOutputMapper(blog);
  }

  // public async getCurrentBlogById(id: string): Promise<BlogsOutputModel> {
  //   const blog = await this.blogsModel.findOne(
  //     { id },
  //     {
  //       _v: false,
  //     },
  //   );
  //   if (!blog) {
  //     throw new NotFoundException();
  //   }
  //   return BlogsOutputMapper(blog);
  // }
}
