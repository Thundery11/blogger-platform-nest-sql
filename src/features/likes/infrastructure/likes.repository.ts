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
  whatIsMyStatusMapper,
} from '../api/models/likes-output-models';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
    "commentId", "myStatus", "createdAt" 
    FROM public."LikesForComments" WHERE "userId" = $1 AND "commentId" = $2;`;
    const like = await this.dataSource.query(selectQuery, [userId, _parentId]);
    if (!like[0]) return null;
    return like[0];
  }

  async addLikePosts(like: LikesDbType): Promise<boolean> {
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

  async updateLikePosts(
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

  async countLikesPosts(_parentId: number): Promise<number> {
    return await this.likesModel.countDocuments({
      parentId: _parentId,
      myStatus: MyStatus.Like,
    });
  }
  async countDislikesPosts(_parentId: number): Promise<number> {
    return await this.likesModel.countDocuments({
      parentId: _parentId,
      myStatus: MyStatus.Dislike,
    });
  }

  async whatIsMyStatusPosts(
    userId: number,
    _parentId: number,
  ): Promise<string> {
    const whatIsMyStatus = await this.likesModel.findOne({
      userId: userId,
      parentId: _parentId,
    });
    if (!whatIsMyStatus) {
      return 'None';
    }

    return whatIsMyStatusMapper(whatIsMyStatus).myStatus;
  }

  async lastLiked(lastLiked: LastLikedType): Promise<LastLikedDocument> {
    const lastLikedEntity = new this.lastLikedModel(lastLiked);
    lastLikedEntity.save();
    return lastLikedEntity;
  }
  async deleteLastLiked(userId: number, postId: number): Promise<boolean> {
    const result = await this.lastLikedModel.deleteOne({
      userId: userId,
      postId: postId,
    });
    return result.deletedCount === 1;
  }
  async isItFirstLike(
    userId: number,
    postId: number,
  ): Promise<LastLikedDocument | null> {
    return await this.lastLikedModel.findOne({ userId, postId });
  }

  async getLastLikes(postId: number): Promise<LastLikedOutputType[]> {
    return await this.lastLikedModel
      .find({ postId }, { _id: 0, __v: 0, postId: 0 })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }
}
