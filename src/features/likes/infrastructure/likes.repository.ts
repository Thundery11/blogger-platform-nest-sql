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
  WhatIsMyStatus,
  whatIsMyStatusMapper,
} from '../api/models/likes-output-models';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(LikesDbModel.name) private likesModel: Model<LikesDbModel>,
    @InjectModel(LastLikedDbModel.name)
    private lastLikedModel: Model<LastLikedDbModel>,
  ) {}
  async isLikeExist(
    userId: number,
    _parentId: number,
  ): Promise<LikesDocument | null> {
    return await this.likesModel.findOne(
      { userId: userId, parentId: _parentId },
      { _id: 0, __v: 0 },
    );
  }

  async addLike(like: LikesDbType): Promise<boolean> {
    const createdLike = new this.likesModel(like);
    createdLike.save();
    return true;
  }

  async updateLike(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const result = await this.likesModel.updateOne(
      { userId: userId, parentId: _parentId },
      { myStatus: _myStatus },
    );
    return result.modifiedCount === 1;
  }

  async countLikes(_parentId: number): Promise<number> {
    return await this.likesModel.countDocuments({
      parentId: _parentId,
      myStatus: MyStatus.Like,
    });
  }
  async countDislikes(_parentId: number): Promise<number> {
    return await this.likesModel.countDocuments({
      parentId: _parentId,
      myStatus: MyStatus.Dislike,
    });
  }

  async whatIsMyStatus(userId: number, _parentId: number): Promise<string> {
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
