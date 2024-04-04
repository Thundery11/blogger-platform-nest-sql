import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../domain/posts.entity';
import { Model, Types } from 'mongoose';
import {
  PostOutputModel,
  postsOutputMapperFinally,
} from '../api/models/output/post-output.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async getPostById(postId: number): Promise<PostOutputModel> {
    const post = await this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
    FROM public."Posts" WHERE "id" = $1;`,
      [postId],
    );
    if (!post) {
      throw new NotFoundException();
    }

    return postsOutputMapperFinally(post);
  }
}
