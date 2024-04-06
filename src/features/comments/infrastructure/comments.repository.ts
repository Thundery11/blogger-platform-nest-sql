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
    commentId: string,
  ): Promise<CommentsDocument | null> {
    const result = await this.commentsModel.findById(
      new Types.ObjectId(commentId),
    );
    console.log('result:', result);
    if (!result) {
      return null;
    }
    console.log(content);
    Object.assign(result, content);
    return result.save();
    // const result = await this.commentsModel.updateOne(
    //   { _id: new Types.ObjectId(commentId) },
    //   content,
    // );
    // return result.matchedCount === 1 ? true : false;
  }

  async deleteComment(commentId: number): Promise<boolean> {
    const result = await this.commentsModel.deleteOne({
      _id: new Types.ObjectId(commentId),
    });
    return result.deletedCount ? true : false;
  }

  async getComments(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    postId: string,
  ): Promise<CommentsOutputModel[]> {
    const comments = await this.commentsModel
      .find({ postId: postId }, { id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize));
    console.log('repoComments: ', comments);
    return AllCommentsOutputMapper(comments);
  }
  async countAllDocumentsForCurrentPost(postId: string): Promise<number> {
    return await this.commentsModel.countDocuments({ postId: postId });
  }
}
