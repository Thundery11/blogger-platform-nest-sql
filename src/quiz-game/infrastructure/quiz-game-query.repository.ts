import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress } from '../domain/player-progress.entity';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(Game) private quizGameQueryRepo: Repository<Game>,
  ) {}
  async isUserAlreadyInGame(id: number): Promise<PlayerProgress | null> {
    const game = await this.playerProgressRepo.findOne({
      where: { playerId: id },
    });
    return game;
  }

  async findGame(id: number) {
    const game = await this.quizGameQueryRepo
      .createQueryBuilder('g')
      .select([
        'g.id',
        'g.status',
        'g.pairCreatedDate',
        'g.startGameDate',
        'g.finishGameDate',
        'fppa.id as questionId',
        'fppa.answerStatus',
        'fppa.addedAt',
        'u.login',
        'u.id',
        'fpp.score',
        'sppa.id as questionId',
        'sppa.answerStatus',
        'sppa.addedAt',
        'su.login',
        'su.id',
        'spp.score',
        'qq.body',
        'qq.id',
      ])
      .leftJoin('g.firstPlayerProgress', 'fpp')
      .leftJoin('fpp.player', 'u')
      .leftJoin('fpp.answers', 'fppa')
      .leftJoin('g.secondPlayerProgress', 'spp')
      .leftJoin('spp.player', 'su')
      .leftJoin('spp.answers', 'sppa')
      .leftJoin('g.questions', 'q')
      .leftJoin('q.question', 'qq')
      .where(`g.id = :id`, { id: id })
      .getOne();
    return game;
  }
}
