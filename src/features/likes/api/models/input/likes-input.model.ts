import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MyStatus } from '../../../domain/likes.entity';

export class LikesDbType {
  constructor(
    public userId: string,
    public parentId: string,
    public createdAt: string,
    public myStatus: MyStatus,
  ) {}
}

export class LastLikedType {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
    public postId: string,
  ) {}
}

export class LikeStatus {
  @IsEnum(MyStatus)
  @IsNotEmpty()
  likeStatus: MyStatus;
}

export class UpdateLikeDto {
  constructor(
    public commentId: string,
    public currentUserId: string,
    public likeStatus: MyStatus,
  ) {}
}
export class UpdateLikeForPostsDto {
  constructor(
    public postId: string,
    public currentUserId: string,
    public likeStatusModel: MyStatus,
  ) {}
}
