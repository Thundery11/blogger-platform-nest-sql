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
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}
  async createComment(comment: Comments): Promise<Comments> {
    try {
      return await this.commentsRepository.save(comment);
    } catch (e) {
      throw e;
    }
    // const insertQuery = `INSERT INTO public."Comments"(
    //   "postId", "content", "userId", "createdAt")
    //    VALUES (${comment.postId}, $1,
    //    ${comment.userId}, '${comment.createdAt}') RETURNING id;`;

    // const createdComment = await this.dataSource.query(insertQuery, [
    //   comment.content,
    // ]);
    // return createdComment[0].id;
  }
  async updateComment(
    content: CreateCommentInputModel,
    commentId: number,
  ): Promise<boolean> {
    try {
      const res = await this.commentsRepository.update(
        { id: commentId },
        { content: content.content },
      );
      //   const updateQuery = `UPDATE public."Comments"
      // SET "content" = $1
      // WHERE "id" = $2;`;
      //   const result = await this.dataSource.query(updateQuery, [
      //     content.content,
      //     commentId,
      //   ]);
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(commentId: number): Promise<boolean> {
    try {
      const res = await this.commentsRepository.delete({ id: commentId });
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
    // const deleteQuery = `DELETE FROM public."Comments"
    // WHERE "id" = $1
    // RETURNING "id";`;
    // const result = await this.dataSource.query(deleteQuery, [commentId]);
  }

  async getComments(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    postId: number,
  ): Promise<CommentsOutputModel[]> {
    try {
      const comments = await this.commentsRepository
        .createQueryBuilder('c')
        .leftJoin('c.user', 'u')
        .select(['c.id', 'c.content', 'c.userId', 'c.createdAt', 'u.login'])
        .where(`c.postId = :postId`, { postId })
        .orderBy(`c.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
        .skip(skip)
        .take(pageSize)
        .getMany();
      return AllCommentsOutputMapper(comments);
    } catch (e) {
      throw e;
    }
    //   const selectQuery = `SELECT c."id", c."content", c."userId", c."createdAt", u."login" as "userLogin"
    //   FROM public."Comments" c
    //   LEFT JOIN "Users" u
    //   ON u."id" = c."userId"
    //   WHERE "postId" = $1
    //   ORDER BY "${sortBy}" ${sortDirection}
    //      LIMIT ${pageSize} OFFSET ${skip}
    // ;`;
    //   const comments = await this.dataSource.query(selectQuery, [postId]);
    //   console.log('🚀 ~ CommentsRepository ~ comments:', comments);

    //   return AllCommentsOutputMapper(comments);
  }
  async countAllDocumentsForCurrentPost(postId: number): Promise<number> {
    const count = await this.commentsRepository.count({ where: { postId } });
    //   const result = await this.dataSource.query(
    //     `SELECT COUNT(*)
    //  FROM public."Comments"
    //  WHERE "postId" = $1;`,
    //     [postId],
    //   );
    return Number(count);
  }
}
