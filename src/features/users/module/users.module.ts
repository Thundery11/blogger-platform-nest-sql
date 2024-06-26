import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UsersController } from '../api/users.controller';
import { Users } from '../domain/users.entity';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
import { EmailAdapter } from '../../../infrastucture/adapters/email-adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingAllDataController } from '../../testingAllData/testingAllData';
import { SecurityDevices } from '../../security-devices/domain/security-devices.entity';
import { Blogs } from '../../blogs/domain/blogs.entity';
import { Posts } from '../../posts/domain/posts.entity';
import { LikesForPosts } from '../../likes/domain/likes-for-posts.entity';
import { LastLiked } from '../../likes/domain/last-liked.entity';
import { Comments } from '../../comments/domain/comments.entity';
import { LikesForComments } from '../../likes/domain/likes-for-comments.entity';
import { QuizQuestionsRepository } from '../../../quizQuestions/api/infrastructure/quiz-questions.repository';
import { QuizQuestions } from '../../../quizQuestions/domain/quiz-questions.entity';
import { PlayerProgress } from '../../../quiz-game/domain/player-progress.entity';
import { Answers } from '../../../quiz-game/domain/quiz-answers.entity';
import { Game } from '../../../quiz-game/domain/quiz-game.entity';
import { Statistics } from '../../../quiz-game/domain/statistics-quiz-game.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Blogs,
      Posts,
      LikesForPosts,
      LastLiked,
      Comments,
      LikesForComments,
      Users,
      SecurityDevices,
      QuizQuestions,
      Game,
      Answers,
      PlayerProgress,
      Statistics,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    // TestingAllDataController,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    EmailsManager,
    EmailAdapter,
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
