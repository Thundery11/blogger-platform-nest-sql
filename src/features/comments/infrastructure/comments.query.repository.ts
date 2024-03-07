import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from '../domain/comments.entity';
import { Model, Types } from 'mongoose';
import {
  CommentsOutputModel,
  commentsOutputQueryMapper,
} from '../api/models/output/comments-model.output';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async getCommentById(
    id: Types.ObjectId,
  ): Promise<CommentsOutputModel | null> {
    const comment = await this.commentsModel.findById(id, { _v: false });
    if (!comment) {
      return null;
    }
    return commentsOutputQueryMapper(comment);
  }
}
