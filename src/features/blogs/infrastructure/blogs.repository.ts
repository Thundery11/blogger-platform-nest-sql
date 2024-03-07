import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model, Types } from 'mongoose';
import {
  BlogsOutputModel,
  allBlogsOutputMapper,
} from '../api/models/output/blog.output.model';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private blogsModel: Model<Blogs>) {}

  public async createBlog(newBlog: Blogs): Promise<BlogsDocument> {
    const createdBlog = new this.blogsModel(newBlog);
    return createdBlog.save();
  }

  public async countDocuments(query: object): Promise<number> {
    return await this.blogsModel.countDocuments(query);
  }

  public async getAllBlogs(
    query: object,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<BlogsOutputModel[]> {
    const blogs = await this.blogsModel
      .find(query, { __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));
    return allBlogsOutputMapper(blogs);
  }

  public async updateBlog(
    id: string,
    blogsUpdateModel: BlogsCreateModel,
  ): Promise<boolean> {
    const result = await this.blogsModel.updateOne(
      { _id: new Types.ObjectId(id) },
      blogsUpdateModel,
    );

    return result.matchedCount === 1 ? true : false;
  }

  public async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount ? true : false;
  }
}
