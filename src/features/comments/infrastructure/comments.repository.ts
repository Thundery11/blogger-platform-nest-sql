import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { Model, Types } from 'mongoose';
import {
  CreateCommentDto,
  CreateCommentInputModel,
} from '../api/models/input/comments-input.model';
import {
  AllCommentsOutputMapper,
  CommentsOutputModel,
} from '../api/models/output/comments-model.output';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async createComment(comment: CreateCommentDto): Promise<number> {
    const insertQuery = `INSERT INTO public."Comments"(
      "postId", "content", "userId", "createdAt")
       VALUES (${comment.postId}, $1, 
       ${comment.userId}, '${comment.createdAt}') RETURNING id;`;

    const createdComment = await this.dataSource.query(insertQuery, [
      comment.content,
    ]);
    return createdComment[0].id;
  }
  async updateComment(
    content: CreateCommentInputModel,
    commentId: number,
  ): Promise<boolean> {
    const updateQuery = `UPDATE public."Comments"
  SET "content" = $1
  WHERE "id" = $2;`;
    const result = await this.dataSource.query(updateQuery, [
      content.content,
      commentId,
    ]);
    return result[1] === 1 ? true : false;
  }

  async deleteComment(commentId: number): Promise<boolean> {
    const deleteQuery = `DELETE FROM public."Comments" 
    WHERE "id" = $1
    RETURNING "id";`;
    const result = await this.dataSource.query(deleteQuery, [commentId]);
    return result[1] === 1 ? true : false;
  }

  async getComments(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    postId: number,
  ): Promise<CommentsOutputModel[]> {
    const comments = await this.commentsModel
      .find({ postId: postId }, { id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));
    console.log('repoComments: ', comments);
    return AllCommentsOutputMapper(comments);
  }
  async countAllDocumentsForCurrentPost(postId: number): Promise<number> {
    return await this.commentsModel.countDocuments({ postId: postId });
  }
}
