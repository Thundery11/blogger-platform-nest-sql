import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../domain/posts.entity';
import { Model, Types } from 'mongoose';
import {
  PostOutputModel,
  postsOutputMapper,
  postsOutputMapperFinally,
} from '../api/models/output/post-output.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}

  public async getPostById(postId: Types.ObjectId): Promise<PostOutputModel> {
    const post = await this.postsModel.findById(postId, {
      _v: false,
    });
    if (!post) {
      throw new NotFoundException();
    }

    return postsOutputMapperFinally(post);
  }
}
