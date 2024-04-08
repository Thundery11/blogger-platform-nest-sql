import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MyStatus } from '../../../domain/likes.entity';

export class LikesDbType {
  constructor(
    public userId: number,
    public parentId: number,
    public createdAt: string,
    public myStatus: MyStatus,
  ) {}
}

export class LastLikedType {
  constructor(
    public addedAt: string,
    public userId: number,
    public postId: number,
  ) {}
}

export class LikeStatus {
  @IsEnum(MyStatus)
  @IsNotEmpty()
  likeStatus: MyStatus;
}

export class UpdateLikeDto {
  constructor(
    public commentId: number,
    public currentUserId: number,
    public likeStatus: MyStatus,
  ) {}
}
export class UpdateLikeForPostsDto {
  constructor(
    public postId: number,
    public currentUserId: number,
    public likeStatusModel: MyStatus,
  ) {}
}
