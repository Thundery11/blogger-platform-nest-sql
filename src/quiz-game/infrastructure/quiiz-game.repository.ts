import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress } from '../domain/player-progress.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';
import { quizGameOutputModel } from '../api/models/output/quiz-game.output.model';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private quizGameRepository: Repository<Game>,
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(QuizQuestions)
    private quizQuestionsRepository: Repository<QuizQuestions>,
  ) {}

  async isGameWithPandingPlayerExist() {
    return await this.quizGameRepository.findOne({
      where: { status: GameStatus.PendingSecondPlayer },
    });
  }
  async addPlayerToTheGame(player: PlayerProgress) {
    return await this.playerProgressRepo.save(player);
  }
  async getPlayer(id: number) {
    const player = await this.playerProgressRepo
      .createQueryBuilder('p')
      .leftJoin('p.player', 'u')
      .leftJoin('p.answers', 'a')
      .select([
        'p.id',
        'p.score',
        'u.login',
        'u.id',
        'a.answerStatus',
        'a.addedAt',
      ])
      .where(`p.playerId = :userId`, { userId: id })
      .getOneOrFail();

    return player;
  }

  async startGame(newGame: Game) {
    const game = await this.quizGameRepository.save(newGame);
    return quizGameOutputModel(game);
  }

  async addSecondPlayerToTheGame(
    secondPlayer: PlayerProgress,
    startGameDate: string,
    status: GameStatus,
    quizQuestion,
  ) {
    const result = await this.quizGameRepository
      .createQueryBuilder()
      .update()
      .set({
        secondPlayerProgress: secondPlayer,
        startGameDate: startGameDate,
        status: status,
        questions: quizQuestion,
      })
      .execute();
    return result.affected === 1;
  }

  async getQuizQuestions() {
    const quizQuestions = await this.quizQuestionsRepository
      .createQueryBuilder('qq')
      .select(['qq.id', 'qq.body', 'qq.correctAnswers'])
      .where({ published: true })
      .orderBy('RANDOM()')
      .take(5)
      .getMany();
    return quizQuestions;
  }

  // async addQuestion(gameId: number){
  //   const question = await this.quizQuestionsRepository.save
  // }

  // async addQuestionsToTheGame(gameId: number) {
  //   const questions = await this.questionsForUsersRepository
  //     .createQueryBuilder('qg')
  //     .select(['qg.question', 'question.body', 'question.id', 'qg.order'])
  //     .leftJoin('qg.question', 'question')
  //     .getMany();
  //   return questions;
  // }
}
