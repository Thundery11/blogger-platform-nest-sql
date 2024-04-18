import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LastLikedDbModel,
  LastLikedDocument,
  LikesDbModel,
  LikesDocument,
  MyStatus,
} from '../domain/likes.entity';
import { Model } from 'mongoose';
import {
  LastLikedType,
  LikesDbType,
} from '../api/models/input/likes-input.model';
import {
  LastLikedOutputType,
  LikesFromDb,
  WhatIsMyStatus,
  lastLikedOutputMapper,
  whatIsMyStatusMapper,
} from '../api/models/likes-output-models';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { add } from 'date-fns';
import { LikesForComments } from '../domain/likes-for-comments.entity';
import { LikesForPosts } from '../domain/likes-for-posts.entity';
import { LastLiked } from '../domain/last-liked.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(LikesForComments)
    private likesForCommentsRepository: Repository<LikesForComments>,
    @InjectRepository(LikesForPosts)
    private likesForPostsRepository: Repository<LikesForPosts>,
    @InjectRepository(LastLiked)
    private lastLikedRepository: Repository<LastLiked>,
  ) {}
  async isLikeExistComments(
    userId: number,
    _parentId: number,
  ): Promise<LikesForComments | null> {
    try {
      const isLikeExist = await this.likesForCommentsRepository.findOne({
        where: { userId: userId, commentId: _parentId },
      });
      if (!isLikeExist) return null;
      return isLikeExist;
      // const selectQuery = `SELECT "id", "userId",
      // "commentId", "myStatus", "createdAt"
      // FROM public."LikesForComments" WHERE "userId" = $1 AND "commentId" = $2;`;
      // const like = await this.dataSource.query(selectQuery, [userId, _parentId]);
      // if (!like[0]) return null;
      // return like[0];
    } catch (e) {
      throw e;
    }
  }

  async addLikeComments(like: LikesForComments): Promise<boolean> {
    try {
      const newLike = await this.likesForCommentsRepository.save(like);
      if (!newLike) return false;
      return true;
    } catch (e) {
      throw e;
    }
    // const insertQuery = `INSERT INTO public."LikesForComments"
    // ("userId", "commentId","createdAt", "myStatus")
    // VALUES ($1, $2, $3, $4) RETURNING id;`;
    // const createdLike = await this.dataSource.query(insertQuery, [
    //   like.userId,
    //   like.parentId,
    //   like.createdAt,
    //   like.myStatus,
    // ]);
    // return createdLike[0].id ? true : false;
  }

  async updateLikeComments(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    try {
      const res = await this.likesForCommentsRepository.update(
        { userId: userId, commentId: _parentId },
        { myStatus: _myStatus },
      );
      // const updateQuery = `UPDATE public."LikesForComments"
      // SET "myStatus" = '${_myStatus}'
      // WHERE "userId" = $1 AND "commentId" = $2;`;

      // const result = await this.dataSource.query(updateQuery, [
      //   userId,
      //   _parentId,
      // ]);
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
  }

  async countLikesComments(_parentId: number): Promise<number> {
    try {
      const count = await this.likesForCommentsRepository.count({
        where: { commentId: _parentId, myStatus: MyStatus.Like },
      });
      console.log('🚀 ~ LikesRepository ~ countLikesComments ~ count:', count);
      return count;
    } catch (e) {
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `SELECT COUNT(*) FROM
    // public."LikesForComments"
    // WHERE "commentId" = $1 AND "myStatus" = $2;`,
    //   [_parentId, MyStatus.Like],
    // );
    // return Number(result[0].count);
  }
  async countDislikesComments(_parentId: number): Promise<number> {
    try {
      const count = await this.likesForCommentsRepository.count({
        where: { commentId: _parentId, myStatus: MyStatus.Dislike },
      });
      console.log('🚀 ~ LikesRepository ~ countLikesComments ~ count:', count);
      return count;
    } catch (e) {
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `SELECT COUNT(*) FROM
    // public."LikesForComments"
    // WHERE "commentId" = $1 AND "myStatus" = $2;`,
    //   [_parentId, MyStatus.Dislike],
    // );
    // return Number(result[0].count);
  }

  async whatIsMyStatusComments(
    userId: number,
    _parentId: number,
  ): Promise<string> {
    try {
      const whatIsMyStatus = await this.likesForCommentsRepository.findOne({
        where: { userId: userId, commentId: _parentId },
      });
      if (!whatIsMyStatus) {
        return MyStatus.None;
      }
      return whatIsMyStatus.myStatus;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT * FROM public."LikesForComments"
    // WHERE "userId" = $1 AND "commentId" = $2;`;
    // const whatIsMyStatus = await this.dataSource.query(selectQuery, [
    //   userId,
    //   _parentId,
    // ]);
    // console.log('🚀 ~ LikesRepository ~ whatIsMyStatus:', whatIsMyStatus);

    // if (!whatIsMyStatus[0]) {
    //   return 'None';
    // }

    // return whatIsMyStatus[0].myStatus;
  }
  async isLikeExistPosts(
    userId: number,
    _parentId: number,
  ): Promise<LikesForPosts | null> {
    try {
      const isLikeExist = await this.likesForPostsRepository.findOne({
        where: { userId: userId, postId: _parentId },
      });
      if (!isLikeExist) return null;
      return isLikeExist;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT "id", "userId",
    // "postId", "myStatus", "createdAt"
    // FROM public."LikesForPosts" WHERE "userId" = $1 AND "postId" = $2;`;
    // const like = await this.dataSource.query(selectQuery, [userId, _parentId]);
    // if (!like[0]) return null;
    // return like[0];
  }

  async addLikePosts(like: LikesForPosts): Promise<boolean> {
    // const insertQuery = `INSERT INTO public."LikesForPosts"
    // ("userId", "postId","createdAt", "myStatus")
    // VALUES ($1, $2, $3, $4) RETURNING id;`;
    // const createdLike = await this.dataSource.query(insertQuery, [
    //   like.userId,
    //   like.parentId,
    //   like.createdAt,
    //   like.myStatus,
    // ]);
    // return createdLike[0].id ? true : false;
    try {
      const newLike = await this.likesForPostsRepository.save(like);
      if (!newLike) return false;
      return true;
    } catch (e) {
      throw e;
    }
  }

  async updateLikePosts(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    try {
      const res = await this.likesForPostsRepository.update(
        { userId: userId, postId: _parentId },
        { myStatus: _myStatus },
      );

      return res.affected === 1;
    } catch (e) {
      throw e;
    }
    // const updateQuery = `UPDATE public."LikesForPosts"
    // SET "myStatus" = '${_myStatus}'
    // WHERE "userId" = $1 AND "postId" = $2;`;

    // const result = await this.dataSource.query(updateQuery, [
    //   userId,
    //   _parentId,
    // ]);
    // return result[1] === 1 ? true : false;
  }

  async countLikesPosts(_parentId: number): Promise<number> {
    try {
      const count = await this.likesForPostsRepository.count({
        where: { postId: _parentId, myStatus: MyStatus.Like },
      });
      console.log('🚀 ~ LikesRepository ~ countLikesPosts ~ count:', count);

      return count;
    } catch (e) {
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `SELECT COUNT(*) FROM
    // public."LikesForPosts"
    // WHERE "postId" = $1 AND "myStatus" = $2;`,
    //   [_parentId, MyStatus.Like],
    // );
    // return Number(result[0].count);
  }
  async countDislikesPosts(_parentId: number): Promise<number> {
    try {
      const count = await this.likesForPostsRepository.count({
        where: { postId: _parentId, myStatus: MyStatus.Dislike },
      });

      return count;
    } catch (e) {
      throw e;
    }
    // const result = await this.dataSource.query(
    //   `SELECT COUNT(*) FROM
    // public."LikesForPosts"
    // WHERE "postId" = $1 AND "myStatus" = $2;`,
    //   [_parentId, MyStatus.Dislike],
    // );
    // return Number(result[0].count);
  }

  async whatIsMyStatusPosts(
    userId: number,
    _parentId: number,
  ): Promise<string> {
    try {
      const whatIsMyStatus = await this.likesForPostsRepository.findOne({
        where: { userId: userId, postId: _parentId },
      });
      console.log('🚀 ~ LikesRepository ~ whatIsMyStatus:', whatIsMyStatus);
      if (!whatIsMyStatus) {
        return MyStatus.None;
      }
      return whatIsMyStatus.myStatus;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT * FROM public."LikesForPosts"
    // WHERE "userId" = $1 AND "postId" = $2;`;
    // const whatIsMyStatus = await this.dataSource.query(selectQuery, [
    //   userId,
    //   _parentId,
    // ]);
    // console.log('🚀 ~ LikesRepository ~ whatIsMyStatus:', whatIsMyStatus);

    // if (!whatIsMyStatus[0]) {
    //   return 'None';
    // }

    // return whatIsMyStatus[0].myStatus;
  }

  async lastLiked(lastLiked: LastLiked): Promise<LastLiked> {
    try {
      return await this.lastLikedRepository.save(lastLiked);
    } catch (e) {
      throw e;
    }
    // const { addedAt, userId, postId } = lastLiked;
    // console.log('🚀 ~ LikesRepository ~ lastLiked ~ lastLiked:', lastLiked);
    // const insertQuery = `INSERT INTO public."LastLiked"
    // ("addedAt", "userId", "postId")
    // VALUES ($1, $2, $3) RETURNING id;`;
    // const result = await this.dataSource.query(insertQuery, [
    //   addedAt,
    //   userId,
    //   postId,
    // ]);

    // return result[0].id;
  }
  async deleteLastLiked(userId: number, postId: number): Promise<boolean> {
    try {
      const res = await this.lastLikedRepository.delete({ userId, postId });
      return res.affected === 1;
    } catch (e) {
      throw e;
    }
    // const deleteQuery = `DELETE FROM public."LastLiked"
    // WHERE "userId" = $1 AND "postId" = $2 RETURNING id`;
    // const result = await this.dataSource.query(deleteQuery, [userId, postId]);
    // console.log('🚀 ~ LikesRepository ~ deleteLastLiked ~ result:', result);
    // return result[1] === 1 ? true : false;
  }
  async isItFirstLike(
    userId: number,
    postId: number,
  ): Promise<LastLiked | null> {
    try {
      const res = await this.lastLikedRepository.findOne({
        where: { userId, postId },
      });
      if (!res) return null;
      return res;
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT * FROM public."LastLiked"
    // WHERE "userId" = $1 AND "postId" = $2;`;
    // const result = await this.dataSource.query(selectQuery, [userId, postId]);
    // if (!result[0]) return null;
    // return result[0];
  }

  async getLastLikes(postId: number): Promise<LastLikedOutputType[]> {
    try {
      const lastLikes = await this.lastLikedRepository
        .createQueryBuilder('ll')
        .leftJoin('ll.user', 'u')
        .select(['ll', 'u.login'])
        .where('ll.postId = :postId', { postId })
        .orderBy('ll.addedAt', 'DESC')
        .take(3)
        .getMany();
      console.log(
        '🚀 ~ LikesRepository ~ getLastLikes ~ lastLikes:',
        lastLikes,
      );
      return lastLikedOutputMapper(lastLikes);
    } catch (e) {
      throw e;
    }
    // const selectQuery = `SELECT l."addedAt", l."userId", u."login"
    // FROM public."LastLiked" l
    // LEFT JOIN "Users" u
    // ON u."id" = l."userId"
    // WHERE "postId" = $1
    // ORDER BY "addedAt" DESC LIMIT 3`;

    // const lastLikes = await this.dataSource.query(selectQuery, [postId]);
    // console.log('🚀 ~ LikesRepository ~ getLastLikes ~ lastLikes:', lastLikes);
    // return lastLikedOutputMapper(lastLikes);
  }
}
