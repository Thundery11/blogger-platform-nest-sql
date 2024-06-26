import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Model } from 'mongoose';
import { Posts } from '../posts/domain/posts.entity';
import { Users } from '../users/domain/users.entity';
import { Comments } from '../comments/domain/comments.entity';
import { LastLikedDbModel, LikesDbModel } from '../likes/domain/likes.entity';
import { SecurityDevices } from '../security-devices/domain/security-devices.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LikesForComments } from '../likes/domain/likes-for-comments.entity';
import { LikesForPosts } from '../likes/domain/likes-for-posts.entity';
import { LastLiked } from '../likes/domain/last-liked.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';
import { Game } from '../../quiz-game/domain/quiz-game.entity';
import { Answers } from '../../quiz-game/domain/quiz-answers.entity';
import { PlayerProgress } from '../../quiz-game/domain/player-progress.entity';
import { Statistics } from '../../quiz-game/domain/statistics-quiz-game.entity';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(SecurityDevices)
    private securityRepo: Repository<SecurityDevices>,
    @InjectRepository(Blogs) private blogsRepo: Repository<Blogs>,
    @InjectRepository(Posts) private postsRepo: Repository<Posts>,
    @InjectRepository(Comments) private commentsRepo: Repository<Comments>,
    @InjectRepository(LikesForComments)
    private likesForCommentsRepo: Repository<LikesForComments>,
    @InjectRepository(LikesForPosts)
    private likesForPostsRepo: Repository<LikesForPosts>,
    @InjectRepository(LastLiked) private lastLikedsRepo: Repository<LastLiked>,
    @InjectRepository(QuizQuestions) private qqRepo: Repository<QuizQuestions>,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Answers) private answersRepo: Repository<Answers>,
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(Statistics) private statsRepo: Repository<Statistics>,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.gameRepo.delete({});
    await this.answersRepo.delete({});
    await this.playerProgressRepo.delete({});
    await this.statsRepo.delete({});
    await this.lastLikedsRepo.delete({});
    await this.likesForCommentsRepo.delete({});
    await this.likesForPostsRepo.delete({});
    await this.commentsRepo.delete({});
    await this.postsRepo.delete({});
    await this.securityRepo.delete({});
    await this.blogsRepo.delete({});
    await this.usersRepo.delete({});
    await this.qqRepo.delete({});
    return true;

    // return await this.dataSource.query(
    //   'TRUNCATE public."users", public."security_devices", public."blogs", public."posts", public."comments", public."likes_for_comments", public."likes_for_posts", public."last_liked", public."quiz_questions" CASCADE',
    // );
  }
}
