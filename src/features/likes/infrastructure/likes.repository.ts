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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { add } from 'date-fns';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(LikesDbModel.name) private likesModel: Model<LikesDbModel>,
    @InjectModel(LastLikedDbModel.name)
    private lastLikedModel: Model<LastLikedDbModel>,
  ) {}
  async isLikeExistComments(
    userId: number,
    _parentId: number,
  ): Promise<LikesFromDb | null> {
    const selectQuery = `SELECT "id", "userId", 
    "commentId", "myStatus", "createdAt" 
    FROM public."LikesForComments" WHERE "userId" = $1 AND "commentId" = $2;`;
    const like = await this.dataSource.query(selectQuery, [userId, _parentId]);
    if (!like[0]) return null;
    return like[0];
  }

  async addLikeComments(like: LikesDbType): Promise<boolean> {
    const insertQuery = `INSERT INTO public."LikesForComments" 
    ("userId", "commentId","createdAt", "myStatus")
    VALUES ($1, $2, $3, $4) RETURNING id;`;
    const createdLike = await this.dataSource.query(insertQuery, [
      like.userId,
      like.parentId,
      like.createdAt,
      like.myStatus,
    ]);
    return createdLike[0].id ? true : false;
  }

  async updateLikeComments(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const updateQuery = `UPDATE public."LikesForComments" 
    SET "myStatus" = '${_myStatus}'
    WHERE "userId" = $1 AND "commentId" = $2;`;

    const result = await this.dataSource.query(updateQuery, [
      userId,
      _parentId,
    ]);
    return result[1] === 1 ? true : false;
  }

  async countLikesComments(_parentId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) FROM 
    public."LikesForComments"
    WHERE "commentId" = $1 AND "myStatus" = $2;`,
      [_parentId, MyStatus.Like],
    );
    return Number(result[0].count);
  }
  async countDislikesComments(_parentId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) FROM 
    public."LikesForComments"
    WHERE "commentId" = $1 AND "myStatus" = $2;`,
      [_parentId, MyStatus.Dislike],
    );
    return Number(result[0].count);
  }

  async whatIsMyStatusComments(
    userId: number,
    _parentId: number,
  ): Promise<string> {
    const selectQuery = `SELECT * FROM public."LikesForComments"
    WHERE "userId" = $1 AND "commentId" = $2;`;
    const whatIsMyStatus = await this.dataSource.query(selectQuery, [
      userId,
      _parentId,
    ]);
    console.log('🚀 ~ LikesRepository ~ whatIsMyStatus:', whatIsMyStatus);

    if (!whatIsMyStatus[0]) {
      return 'None';
    }

    return whatIsMyStatus[0].myStatus;
  }
  async isLikeExistPosts(
    userId: number,
    _parentId: number,
  ): Promise<LikesFromDb | null> {
    const selectQuery = `SELECT "id", "userId", 
    "postId", "myStatus", "createdAt" 
    FROM public."LikesForPosts" WHERE "userId" = $1 AND "postId" = $2;`;
    const like = await this.dataSource.query(selectQuery, [userId, _parentId]);
    if (!like[0]) return null;
    return like[0];
  }

  async addLikePosts(like: LikesDbType): Promise<boolean> {
    const insertQuery = `INSERT INTO public."LikesForPosts" 
    ("userId", "postId","createdAt", "myStatus")
    VALUES ($1, $2, $3, $4) RETURNING id;`;
    const createdLike = await this.dataSource.query(insertQuery, [
      like.userId,
      like.parentId,
      like.createdAt,
      like.myStatus,
    ]);
    return createdLike[0].id ? true : false;
  }

  async updateLikePosts(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const updateQuery = `UPDATE public."LikesForPosts" 
    SET "myStatus" = '${_myStatus}'
    WHERE "userId" = $1 AND "postId" = $2;`;

    const result = await this.dataSource.query(updateQuery, [
      userId,
      _parentId,
    ]);
    return result[1] === 1 ? true : false;
  }

  async countLikesPosts(_parentId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) FROM 
    public."LikesForPosts"
    WHERE "postId" = $1 AND "myStatus" = $2;`,
      [_parentId, MyStatus.Like],
    );
    return Number(result[0].count);
  }
  async countDislikesPosts(_parentId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) FROM 
    public."LikesForPosts"
    WHERE "postId" = $1 AND "myStatus" = $2;`,
      [_parentId, MyStatus.Dislike],
    );
    return Number(result[0].count);
  }

  async whatIsMyStatusPosts(
    userId: number,
    _parentId: number,
  ): Promise<string> {
    const selectQuery = `SELECT * FROM public."LikesForPosts"
    WHERE "userId" = $1 AND "postId" = $2;`;
    const whatIsMyStatus = await this.dataSource.query(selectQuery, [
      userId,
      _parentId,
    ]);
    console.log('🚀 ~ LikesRepository ~ whatIsMyStatus:', whatIsMyStatus);

    if (!whatIsMyStatus[0]) {
      return 'None';
    }

    return whatIsMyStatus[0].myStatus;
  }

  async lastLiked(lastLiked: LastLikedType): Promise<number> {
    const { addedAt, userId, postId } = lastLiked;
    console.log('🚀 ~ LikesRepository ~ lastLiked ~ lastLiked:', lastLiked);
    const insertQuery = `INSERT INTO public."LastLiked"
    ("addedAt", "userId", "postId")
    VALUES ($1, $2, $3) RETURNING id;`;
    const result = await this.dataSource.query(insertQuery, [
      addedAt,
      userId,
      postId,
    ]);

    return result[0].id;
  }
  async deleteLastLiked(userId: number, postId: number): Promise<boolean> {
    const deleteQuery = `DELETE FROM public."LastLiked"
    WHERE "userId" = $1 AND "postId" = $2 RETURNING id`;
    const result = await this.dataSource.query(deleteQuery, [userId, postId]);
    console.log('🚀 ~ LikesRepository ~ deleteLastLiked ~ result:', result);
    return result[1] === 1 ? true : false;
  }
  async isItFirstLike(
    userId: number,
    postId: number,
  ): Promise<LastLikedDocument | null> {
    const selectQuery = `SELECT * FROM public."LastLiked"
    WHERE "userId" = $1 AND "postId" = $2;`;
    const result = await this.dataSource.query(selectQuery, [userId, postId]);
    if (!result[0]) return null;
    return result[0];
  }

  async getLastLikes(postId: number): Promise<LastLikedOutputType[]> {
    const selectQuery = `SELECT l."addedAt", l."userId", u."login" 
    FROM public."LastLiked" l
    LEFT JOIN "Users" u
    ON u."id" = l."userId"
    WHERE "postId" = $1
    ORDER BY "addedAt" DESC LIMIT 3`;

    const lastLikes = await this.dataSource.query(selectQuery, [postId]);
    console.log('🚀 ~ LikesRepository ~ getLastLikes ~ lastLikes:', lastLikes);
    return lastLikedOutputMapper(lastLikes);
  }
}
