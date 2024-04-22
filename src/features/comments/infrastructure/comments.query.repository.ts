import { Injectable } from '@nestjs/common';
import { Comments } from '../domain/comments.entity';
import {
  CommentsOutputModel,
  commentsOutputQueryMapper,
} from '../api/models/output/comments-model.output';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}
  async getCommentById(commentId: number): Promise<CommentsOutputModel | null> {
    try {
      const comment = await this.commentsRepository
        .createQueryBuilder('c')
        .select(['c.id', 'c.content', 'c.createdAt', 'c.userId', 'u.login'])
        .leftJoin('c.user', 'u')
        .where(`c.id = :commentId`, { commentId })
        .getOne();

      // const selectQuery = `SELECT c."id", c."content", c."createdAt", c."userId",
      //  u."login" as "userLogin"
      //  FROM public."Comments" c
      //  LEFT JOIN "Users" u
      //  ON u.id = c."userId"
      //  WHERE c.id = $1`;
      // const comment = await this.dataSource.query(selectQuery, [id]);
      if (!comment) {
        return null;
      }
      return commentsOutputQueryMapper(comment);
    } catch (e) {
      throw e;
    }
  }
}
