import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeForPostsDto } from '../../../likes/api/models/input/likes-input.model';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { LikesService } from '../../../likes/application/likes.service';
import { MyStatus } from '../../../likes/domain/likes.entity';
import { UsersService } from '../../../users/application/users.service';

export class UpdateLikeStatusForPostsCommand {
  constructor(public updatePostLikesDto: UpdateLikeForPostsDto) {}
}
@CommandHandler(UpdateLikeStatusForPostsCommand)
export class UpdateLikeStatusForPostsUseCase
  implements ICommandHandler<UpdateLikeStatusForPostsCommand>
{
  constructor(
    private likesService: LikesService,
    private postsQueryRepository: PostsQueryRepository,
    private usersService: UsersService,
  ) {}
  async execute(command: UpdateLikeStatusForPostsCommand): Promise<any> {
    const isPostExist = await this.postsQueryRepository.getPostById(
      Number(command.updatePostLikesDto.postId),
    );
    console.log('post, that i found at use-case likeStatus: ', isPostExist);
    if (!isPostExist) {
      throw new NotFoundException();
    }
    const user = await this.usersService.findUserById(
      command.updatePostLikesDto.currentUserId,
    );
    if (!user) {
      throw new NotFoundException();
    }

    const login = user.login;
    console.log('userLogin:', login);
    const isLikeExist = await this.likesService.isLikeExist(
      command.updatePostLikesDto.currentUserId,
      command.updatePostLikesDto.postId,
    );
    if (!isLikeExist) {
      const newLike = await this.likesService.addLike(
        command.updatePostLikesDto.currentUserId,
        command.updatePostLikesDto.postId,
        command.updatePostLikesDto.likeStatusModel,
      );
      console.log('firstCreatedLike: ', newLike);
      if (command.updatePostLikesDto.likeStatusModel === MyStatus.Like) {
        const lastLiked = await this.likesService.lastLiked(
          command.updatePostLikesDto.currentUserId,
          login,
          command.updatePostLikesDto.postId,
        );
        console.log('lastLiked', lastLiked);
      }
      return true;
    }
    const result = await this.likesService.updateLike(
      command.updatePostLikesDto.currentUserId,
      command.updatePostLikesDto.postId,
      command.updatePostLikesDto.likeStatusModel,
    );

    console.log('updatedLike: ', result);
    if (!result) {
      throw new NotFoundException();
    }
    if (
      command.updatePostLikesDto.likeStatusModel === MyStatus.Dislike ||
      command.updatePostLikesDto.likeStatusModel === MyStatus.None
    ) {
      await this.likesService.deleteLastLiked(
        command.updatePostLikesDto.currentUserId,
        command.updatePostLikesDto.postId,
      );
    }
    return result;
  }
}
