import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from '../domain/comments.entity';
import { Model, Types } from 'mongoose';
import {
  CommentsOutputModel,
  commentsOutputQueryMapper,
} from '../api/models/output/comments-model.output';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async getCommentById(id: number): Promise<CommentsOutputModel | null> {
    const selectQuery = `SELECT c."id", c."content", c."createdAt", c."userId",
     u."login" as "userLogin"
     FROM public."Comments" c
     LEFT JOIN "Users" u 
     ON u.id = c."userId"
     WHERE c.id = $1`;
    const comment = await this.dataSource.query(selectQuery, [id]);
    if (!comment) {
      return null;
    }
    return commentsOutputQueryMapper(comment);
  }
}
