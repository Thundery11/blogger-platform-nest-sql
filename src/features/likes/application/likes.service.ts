import { Injectable } from '@nestjs/common';
import { LastLikedDocument, MyStatus } from '../domain/likes.entity';
import {
  LastLikedType,
  LikesDbType,
} from '../api/models/input/likes-input.model';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LastLikedOutputType } from '../api/models/likes-output-models';

@Injectable()
export class LikesService {
  constructor(protected likesRepository: LikesRepository) {}

  async isLikeExist(userId: number, _parentId: number): Promise<boolean> {
    const result = await this.likesRepository.isLikeExist(userId, _parentId);
    if (!result) return false;

    return true;
  }

  async addLike(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = new LikesDbType(
      userId,
      _parentId,
      new Date().toISOString(),
      _myStatus,
    );

    return await this.likesRepository.addLike(like);
  }
  async updateLike(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = await this.likesRepository.isLikeExist(userId, _parentId);
    if (like!.myStatus !== _myStatus) {
      return await this.likesRepository.updateLike(
        userId,
        _parentId,
        _myStatus,
      );
    }
    return true;
  }

  async lastLiked(
    userId: number,
    login: string,
    postId: number,
  ): Promise<LastLikedDocument | null> {
    const addedAt = new Date().toISOString();
    const lastLiked = new LastLikedType(addedAt, userId, login, postId);
    console.log(lastLiked, 'LASTLIKED');
    const reaciton = await this.likesRepository.isItFirstLike(userId, postId);
    console.log('reaciton', reaciton);
    if (!reaciton) {
      return await this.likesRepository.lastLiked(lastLiked);
    }
    return null;
  }
  async deleteLastLiked(userId: number, postId: number): Promise<boolean> {
    return await this.likesRepository.deleteLastLiked(userId, postId);
  }
  async getLastLikes(postId: number): Promise<LastLikedOutputType[]> {
    return await this.likesRepository.getLastLikes(postId);
  }
}
