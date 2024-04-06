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

  async isLikeExistComments(
    userId: number,
    _parentId: number,
  ): Promise<boolean> {
    const result = await this.likesRepository.isLikeExistComments(
      userId,
      _parentId,
    );
    if (!result) return false;

    return true;
  }

  async addLikeComments(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const createdAt = new Date().toISOString();
    const like = new LikesDbType(userId, _parentId, createdAt, _myStatus);

    return await this.likesRepository.addLikeComments(like);
  }
  async updateLikeComments(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = await this.likesRepository.isLikeExistComments(
      userId,
      _parentId,
    );
    if (like!.myStatus !== _myStatus) {
      return await this.likesRepository.updateLikeComments(
        userId,
        _parentId,
        _myStatus,
      );
    }
    return true;
  }
  async isLikeExistPosts(userId: number, _parentId: number): Promise<boolean> {
    const result = await this.likesRepository.isLikeExistPosts(
      userId,
      _parentId,
    );
    if (!result) return false;

    return true;
  }

  async addLikePosts(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const createdAt = new Date().toISOString();
    const like = new LikesDbType(userId, _parentId, createdAt, _myStatus);

    return await this.likesRepository.addLikePosts(like);
  }
  async updateLikePosts(
    userId: number,
    _parentId: number,
    _myStatus: MyStatus,
  ): Promise<boolean> {
    const like = await this.likesRepository.isLikeExistComments(
      userId,
      _parentId,
    );
    if (like!.myStatus !== _myStatus) {
      return await this.likesRepository.updateLikePosts(
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
