//add below two lines before all other imports to correct parsing of process.env in all modules
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './features/blogs/domain/blogs.entity';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { TestingAllDataController } from './features/testingAllData/testingAllData';
import { Posts, PostsSchema } from './features/posts/domain/posts.entity';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsController } from './features/posts/api/posts.controller';
import { Users } from './features/users/domain/users.entity';
import { AuthModule } from './features/auth/module/auth.module';
import { UsersModule } from './features/users/module/users.module';
import { CreateBlogUseCase } from './features/blogs/application/use-cases/create-blog-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { FindAllBlogsUseCase } from './features/blogs/application/use-cases/find-all-blogs-use-case';
import { UpdateBlogUseCase } from './features/blogs/application/use-cases/update-blog-use-case';
import { DeleteBlogUseCase } from './features/blogs/application/use-cases/delete-blog-use-case';
import { CreatePostForSpecificBlogUseCase } from './features/blogs/application/use-cases/create-post-for-specific-blog-use-case';
import { FindAllPostsForCurrentBlogUseCase } from './features/posts/application/use-cases/find-all-posts-for-current-blog-use-case';
import { FindAllPostsUseCase } from './features/posts/application/use-cases/find-all-posts-use-case';
import { CreatePostUseCase } from './features/posts/application/use-cases/create-post-use-case';
import { UpdatePostUseCase } from './features/posts/application/use-cases/update-post-use-case';
import { DeletePostUseCase } from './features/posts/application/delete-post-use-case';
import {
  LastLikedDbModel,
  LastLikedDbSchema,
  LikesDbModel,
  LikesDbSchema,
} from './features/likes/domain/likes.entity';
import {
  Comments,
  CommentsSchema,
} from './features/comments/domain/comments.entity';
import { CreateCommentForSpecificPostUseCase } from './features/comments/application/use-cases/create-comment-for-specific-post-use-case';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query.repository';
import { LikesRepository } from './features/likes/infrastructure/likes.repository';
import { LikesService } from './features/likes/application/likes.service';
import { CommentsController } from './features/comments/api/comments.controller';
import { FindCommentUseCase } from './features/comments/application/use-cases/find-comment-use-case';
import { UpdateCommentUseCase } from './features/comments/application/use-cases/update-comment-use-case';
import { DeleteCommentUseCase } from './features/comments/application/use-cases/delete-comment-use-case';
import { UpdateCommentsLikeStatusUseCase } from './features/comments/application/use-cases/update-like-status-use-case';
import { FindAllCommentsUseCase } from './features/posts/application/use-cases/find-all-comments-use-case';
import { IsBlogExistConstraint } from './infrastucture/decorators/validate/is-blog-exist-decorator';
import { UpdateLikeStatusForPostsUseCase } from './features/posts/application/use-cases/update-like-status-for-posts-use-case';
import { FindPostUseCase } from './features/posts/application/use-cases/find-post-use-case';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from './features/security-devices/domain/security-devices.entity';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SuperAdminBlogsController } from './features/blogs/api/super-admin.blogs.controller';
import { LikesForPosts } from './features/likes/domain/likes-for-posts.entity';
import { LastLiked } from './features/likes/domain/last-liked.entity';
import { LikesForComments } from './features/likes/domain/likes-for-comments.entity';
import { QuizQuestionsController } from './quizQuestions/api/quizQuestions.controller';
import { CreateQuizQuestionUseCase } from './quizQuestions/application/use-cases/create-quiz-question-use-case';
import { QuizQuestionsRepository } from './quizQuestions/api/infrastructure/quiz-questions.repository';
import { DeleteQuizQuestionUseCase } from './quizQuestions/application/use-cases/delete-quiz-question-use-case';
import { UpdateQuizQuestionUseCase } from './quizQuestions/application/use-cases/update-quiz-question-use-case';
import { PublishQuestionUseCase } from './quizQuestions/application/use-cases/publish-question-use-case';
import { QuizQuestionsQueryRepository } from './quizQuestions/api/infrastructure/quiz-questions.query.repository';
import { FindAllQuestionsUseCase } from './quizQuestions/application/use-cases/get-all-quiz-questions-use-case';
import { QuizQuestions } from './quizQuestions/domain/quiz-questions.entity';
import { Game } from './quiz-game/domain/quiz-game.entity';
import { Answers } from './quiz-game/domain/quiz-answers.entity';
import { PlayerProgress } from './quiz-game/domain/player-progress.entity';
import { QuizGameService } from './quiz-game/application/quiz-game.service';
import { QuizGameRepository } from './quiz-game/infrastructure/quiiz-game.repository';
import { QuizGameQueryRepository } from './quiz-game/infrastructure/quiz-game-query.repository';
import { QuizGameController } from './quiz-game/api/quiz-game.controller';
import { AddAnswerUseCase } from './quiz-game/application/use-cases/add-answer.use-case';
import { ConnectToTheGameUseCase } from './quiz-game/application/use-cases/connect-to-the-game.use-case';
import { GetMyGamesUseCase } from './quiz-game/application/use-cases/get-my-games-use-case';
import { GetMyStatisticUseCase } from './quiz-game/application/use-cases/get-my-statistic-use-case';

const useCases = [
  CreateBlogUseCase,
  FindAllBlogsUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostForSpecificBlogUseCase,
  FindAllPostsForCurrentBlogUseCase,
  FindAllPostsUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateCommentForSpecificPostUseCase,
  FindCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentsLikeStatusUseCase,
  FindAllCommentsUseCase,
  UpdateLikeStatusForPostsUseCase,
  FindPostUseCase,
  CreateQuizQuestionUseCase,
  DeleteQuizQuestionUseCase,
  UpdateQuizQuestionUseCase,
  PublishQuestionUseCase,
  FindAllQuestionsUseCase,
  AddAnswerUseCase,
  ConnectToTheGameUseCase,
  GetMyGamesUseCase,
  GetMyStatisticUseCase,
];
const {
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGPORT,
  LOCALHOST,
  LOCALDATABASE,
  LOCALUSER,
  LOCALPASSWORD,
  LOCALPORT,
} = process.env;

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  // url: 'postgres://Blogger-platform-db_owner:ZEHlI8zxaqb0@ep-sparkling-feather-a2nkv6w8.eu-central-1.aws.neon.tech/blogger-platform-db-typeorm?sslmode=require',
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  autoLoadEntities: true,
  synchronize: true,
  // logging: ['query'],
  ssl: true,
  // ssl: false, //менять на true, когда подключаешь NeonDb
};

export const localDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5000,
  username: 'nodejs',
  password: 'nodejs',
  database: 'BankSystem',
  autoLoadEntities: true,
  synchronize: true,
  // logging: ['query'],
  ssl: false,
};
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CqrsModule,
    TypeOrmModule.forRoot(options),
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
    ]),
    // ConfigModule.forRoot(),
    //как правильно импортировать МОДЕЛИ? можно ли их импортировать в разные модули
    MongooseModule.forFeature([
      {
        name: Blogs.name,
        schema: BlogsSchema,
      },
      { name: Posts.name, schema: PostsSchema },
      //если убираю модель юзеров, падает приложение, почему???

      {
        name: Comments.name,
        schema: CommentsSchema,
      },
      {
        name: LikesDbModel.name,
        schema: LikesDbSchema,
      },
      {
        name: LastLikedDbModel.name,
        schema: LastLikedDbSchema,
      },
      {
        name: SecurityDevices.name,
        schema: SecurityDevicesSchema,
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'blogger-platform-nest',
    }),
  ],
  controllers: [
    TestingAllDataController,
    AppController,
    BlogsController,
    PostsController,
    CommentsController,
    SuperAdminBlogsController,
    QuizQuestionsController,
    QuizGameController,
  ],

  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
    LikesService,
    IsBlogExistConstraint,
    QuizQuestionsRepository,
    QuizQuestionsQueryRepository,
    QuizGameService,
    QuizGameRepository,
    QuizGameQueryRepository,

    ...useCases,
  ],
})
export class AppModule {}
