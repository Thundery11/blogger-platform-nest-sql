import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeForPostsDto } from '../../../likes/api/models/input/likes-input.model';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
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
    const { updatePostLikesDto } = command;
    const { postId, currentUserId, likeStatusModel } = updatePostLikesDto;
    const isPostExist = await this.postsQueryRepository.getPostById(postId);
    console.log('post, that i found at use-case likeStatus: ', isPostExist);
    if (!isPostExist) {
      throw new NotFoundException();
    }
    const user = await this.usersService.findUserById(currentUserId);
    if (!user) {
      throw new NotFoundException();
    }

    const login = user.login;
    console.log('userLogin:', login);
    const isLikeExist = await this.likesService.isLikeExistPosts(
      currentUserId,
      postId,
    );
    if (!isLikeExist) {
      const newLike = await this.likesService.addLikePosts(
        currentUserId,
        postId,
        likeStatusModel,
      );
      console.log('firstCreatedLike: ', newLike);
      if (likeStatusModel === MyStatus.Like) {
        const lastLiked = await this.likesService.lastLiked(
          currentUserId,
          login,
          postId,
        );
        console.log('lastLiked', lastLiked);
      }
      return true;
    }
    const result = await this.likesService.updateLikePosts(
      currentUserId,
      postId,
      likeStatusModel,
    );

    console.log('updatedLike: ', result);
    if (!result) {
      throw new NotFoundException();
    }
    if (
      likeStatusModel === MyStatus.Dislike ||
      likeStatusModel === MyStatus.None
    ) {
      await this.likesService.deleteLastLiked(currentUserId, postId);
    }
    return result;
  }
}
