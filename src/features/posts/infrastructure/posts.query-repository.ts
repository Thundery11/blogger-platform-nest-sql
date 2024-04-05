import { Injectable, NotFoundException } from '@nestjs/common';
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
      `SELECT p.*, b."name" as "blogName"
      FROM public."Posts" p
      LEFT JOIN "Blogs" b
      ON b.id = p."blogId"
      WHERE p."id" = $1;`,
      [postId],
    );
    if (!post) {
      throw new NotFoundException();
    }

    return postsOutputMapperFinally(post);
  }
}
