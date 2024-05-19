import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress, PlayerStatus } from '../domain/player-progress.entity';
import {
  getPlayerProgressId,
  quizGameOutputModel,
} from '../api/models/output/quiz-game.output.model';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(Game) private quizGameQueryRepo: Repository<Game>,
  ) {}
  async isUserAlreadyInGame(id: number): Promise<PlayerProgress | null> {
    const game = await this.playerProgressRepo.findOne({
      where: { playerId: id, status: PlayerStatus.Active },
    });
    return game;
  }

  async findGame(id: number) {
    const game = await this.quizGameQueryRepo
      .createQueryBuilder('game')
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
        'firstPlayerAnswers.questionId',
        'firstPlayerAnswers.answerStatus',
        'firstPlayerAnswers.addedAt',
        'firstPlayer.login',
        'firstPlayer.id',
        'firstPlayerProgress.score',
        'secondPlayerAnswers.questionId',
        'secondPlayerAnswers.answerStatus',
        'secondPlayerAnswers.addedAt',
        'secondPlayer.login',
        'secondPlayer.id',
        'secondPlayerProgress.score',
        'game.questions',
      ])
      .leftJoin('game.firstPlayerProgress', 'firstPlayerProgress')
      .leftJoin('firstPlayerProgress.player', 'firstPlayer')
      .leftJoin('firstPlayerProgress.answers', 'firstPlayerAnswers')
      .leftJoin('game.secondPlayerProgress', 'secondPlayerProgress')
      .leftJoin('secondPlayerProgress.player', 'secondPlayer')
      .leftJoin('secondPlayerProgress.answers', 'secondPlayerAnswers')
      .where(`game.id = :id`, { id: id })
      .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
      .addOrderBy('secondPlayerAnswers.addedAt', 'ASC')
      .getOne();
    if (!game) {
      return null;
    }

    console.log('🚀 ~ QuizGameQueryRepository ~ findGame ~ game:', game);
    return quizGameOutputModel(game);
  }

  async findGameForCurrentUser(id: number) {
    const game = await this.quizGameQueryRepo
      .createQueryBuilder('game')
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
        'firstPlayerAnswers.questionId',
        'firstPlayerAnswers.answerStatus',
        'firstPlayerAnswers.addedAt',
        'firstPlayer.login',
        'firstPlayer.id',
        'firstPlayerProgress.score',
        'secondPlayerAnswers.questionId',
        'secondPlayerAnswers.answerStatus',
        'secondPlayerAnswers.addedAt',
        'secondPlayer.login',
        'secondPlayer.id',
        'secondPlayerProgress.score',
        'game.questions',
      ])
      .leftJoin('game.firstPlayerProgress', 'firstPlayerProgress')
      .leftJoin('firstPlayerProgress.player', 'firstPlayer')
      .leftJoin('firstPlayerProgress.answers', 'firstPlayerAnswers')
      .leftJoin('game.secondPlayerProgress', 'secondPlayerProgress')
      .leftJoin('secondPlayerProgress.player', 'secondPlayer')
      .leftJoin('secondPlayerProgress.answers', 'secondPlayerAnswers')
      .where(`game.firstPlayerProgressId = :id`, { id: id })
      .orWhere(`game.secondPlayerProgressId = :id`, { id: id })
      .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
      .addOrderBy('secondPlayerAnswers.addedAt', 'ASC')
      // .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
      .getOne();
    if (!game) {
      return null;
    }

    // console.log('🚀 ~ QuizGameQueryRepository ~ findGame ~ game:', game);
    return quizGameOutputModel(game);
  }

  async isGameStarted(id: number) {
    const game = await this.quizGameQueryRepo
      .createQueryBuilder('game')
      .select(['game.id'])
      .where(
        `(game.firstPlayerProgressId = :id OR game.secondPlayerProgressId = :id)`,
      )
      .andWhere(`game.startGameDate IS NOT NULL`)
      .setParameters({ id: id })
      .getOne();
    return game;
  }

  async findNotMappedGameForCurrentUser(id: number) {
    const game = await this.quizGameQueryRepo
      .createQueryBuilder('game')
      .select([
        'game.id',
        'game.status',
        'game.pairCreatedDate',
        'game.startGameDate',
        'game.finishGameDate',
        'game.firstPlayerProgressId',
        'game.secondPlayerProgressId',
        'firstPlayerAnswers.questionId',
        'firstPlayerAnswers.answerStatus',
        'firstPlayerAnswers.addedAt',
        'firstPlayer.login',
        'firstPlayer.id',
        'firstPlayerProgress.score',
        'firstPlayerProgress.id',
        'secondPlayerAnswers.questionId',
        'secondPlayerAnswers.answerStatus',
        'secondPlayerAnswers.addedAt',
        'secondPlayer.login',
        'secondPlayer.id',
        'secondPlayerProgress.score',
        'secondPlayerProgress.id',
        'game.questions',
      ])
      .leftJoin('game.firstPlayerProgress', 'firstPlayerProgress')
      .leftJoin('firstPlayerProgress.player', 'firstPlayer')
      .leftJoin('firstPlayerProgress.answers', 'firstPlayerAnswers')
      .leftJoin('game.secondPlayerProgress', 'secondPlayerProgress')
      .leftJoin('secondPlayerProgress.player', 'secondPlayer')
      .leftJoin('secondPlayerProgress.answers', 'secondPlayerAnswers')
      .where(`game.firstPlayerProgressId = :id`, { id: id })
      .orWhere(`game.secondPlayerProgressId = :id`, { id: id })
      .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
      .addOrderBy('secondPlayerAnswers.addedAt', 'ASC')
      // .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
      .getOne();
    if (!game) {
      return null;
    }

    console.log('🚀 ~ QuizGameQueryRepository ~ findGame ~ game:', game);
    return game;
  }
}
