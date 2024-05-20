import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress, PlayerStatus } from '../domain/player-progress.entity';
import {
  QuizGameOutputModel,
  allGamesOutputMapper,
  getPlayerProgressId,
  quizGameOutputModel,
} from '../api/models/output/quiz-game.output.model';
import { skip } from 'node:test';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(Game) private quizGameQueryRepo: Repository<Game>,
  ) {}
  async findGameById(id: number): Promise<PlayerProgress | null> {
    const game = await this.playerProgressRepo.findOne({
      where: { playerId: id },
    });
    return game;
  }
  async isUserAlreadyInGame(id: number): Promise<PlayerProgress | null> {
    const game = await this.playerProgressRepo
      .createQueryBuilder('playerProgress')
      .where('playerProgress.playerId = :playerId', { playerId: id })
      .andWhere('playerProgress.status = :status', {
        status: PlayerStatus.Active,
      })
      .getOne();
    return game;
  }

  async findGame(id: number): Promise<QuizGameOutputModel | null> {
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
    return quizGameOutputModel(game);
  }

  async findGameForCurrentUser(
    id: number,
  ): Promise<QuizGameOutputModel | null> {
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

  async findNotMappedGameForCurrentUser(id: number): Promise<Game | null> {
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
    return game;
  }

  // async findMyGames(
  //   sortBy: string,
  //   sortDirection: string,
  //   pageSize: number,
  //   skip: number,
  //   currentUserId: number,
  // ) {
  //   const queryBuilder = this.quizGameQueryRepo
  //     .createQueryBuilder('game')
  //     .select([
  //       'game.id',
  //       'game.status',
  //       'game.pairCreatedDate',
  //       'game.startGameDate',
  //       'game.finishGameDate',
  //       'firstPlayerAnswers.questionId',
  //       'firstPlayerAnswers.answerStatus',
  //       'firstPlayerAnswers.addedAt',
  //       'firstPlayer.login',
  //       'firstPlayer.id',
  //       'firstPlayerProgress.score',
  //       'secondPlayerAnswers.questionId',
  //       'secondPlayerAnswers.answerStatus',
  //       'secondPlayerAnswers.addedAt',
  //       'secondPlayer.login',
  //       'secondPlayer.id',
  //       'secondPlayerProgress.score',
  //       'game.questions',
  //     ])
  //     .leftJoin('game.firstPlayerProgress', 'firstPlayerProgress')
  //     .leftJoin('firstPlayerProgress.player', 'firstPlayer')
  //     .leftJoin('firstPlayerProgress.answers', 'firstPlayerAnswers')
  //     .leftJoin('game.secondPlayerProgress', 'secondPlayerProgress')
  //     .leftJoin('secondPlayerProgress.player', 'secondPlayer')
  //     .leftJoin('secondPlayerProgress.answers', 'secondPlayerAnswers')
  //     .where(`firstPlayer.id = :id`, { id: currentUserId })
  //     .orWhere(`secondPlayer.id = :id`, { id: currentUserId })
  //     .addOrderBy('firstPlayerAnswers.addedAt', 'ASC')
  //     .addOrderBy('secondPlayerAnswers.addedAt', 'ASC')
  //     .addOrderBy(`game.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
  //     .addOrderBy(`game.pairCreatedDate`, 'DESC')
  //     .skip(skip)
  //     .take(pageSize);

  //   console.log(queryBuilder.getSql());
  //   const myGames = await queryBuilder.getMany();
  //   console.log('🚀 ~ QuizGameQueryRepository ~ myGames:', myGames);

  //   if (!myGames) {
  //     return null;
  //   }
  //   return myGames;
  // }

  async findMyGames(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    currentUserId: number,
  ) {
    const subQuery = this.quizGameQueryRepo
      .createQueryBuilder('game')
      .select('game.id')
      .leftJoin('game.firstPlayerProgress', 'firstPlayerProgress')
      .leftJoin('firstPlayerProgress.player', 'firstPlayer')
      .leftJoin('game.secondPlayerProgress', 'secondPlayerProgress')
      .leftJoin('secondPlayerProgress.player', 'secondPlayer')
      .where('firstPlayer.id = :id', { id: currentUserId })
      .orWhere('secondPlayer.id = :id', { id: currentUserId })
      .orderBy(`game.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
      .addOrderBy('game.pairCreatedDate', 'DESC')
      .skip(skip)
      .take(pageSize);

    const queryBuilder = this.quizGameQueryRepo
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
      .where(`game.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .orderBy('firstPlayerAnswers.addedAt', 'ASC')
      .addOrderBy('secondPlayerAnswers.addedAt', 'ASC')
      .addOrderBy(`game.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
      .addOrderBy('game.pairCreatedDate', 'DESC');

    console.log(queryBuilder.getSql());
    const myGames = await queryBuilder.getMany();
    console.log('🚀 ~ QuizGameQueryRepository ~ myGames:', myGames);

    if (!myGames) {
      return null;
    }
    return allGamesOutputMapper(myGames);
  }
}
