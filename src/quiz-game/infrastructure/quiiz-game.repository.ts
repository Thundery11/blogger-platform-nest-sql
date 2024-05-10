import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress } from '../domain/player-progress.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';
import { quizGameOutputModel } from '../api/models/output/quiz-game.output.model';
import { Answers } from '../domain/quiz-answers.entity';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private quizGameRepository: Repository<Game>,
    @InjectRepository(PlayerProgress)
    private playerProgressRepo: Repository<PlayerProgress>,
    @InjectRepository(QuizQuestions)
    private quizQuestionsRepository: Repository<QuizQuestions>,
    @InjectRepository(Answers) private answersRepository: Repository<Answers>,
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
    const game = await this.quizGameRepository.findOne({
      where: { status: GameStatus.PendingSecondPlayer },
    });
    if (!game) {
      throw new NotFoundException();
    }
    game.secondPlayerProgress = secondPlayer;
    game.startGameDate = startGameDate;
    game.status = status;
    game.questions = quizQuestion;

    return await this.quizGameRepository.save(game);
    // const result = await this.quizGameRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     secondPlayerProgress: secondPlayer,
    //     startGameDate: startGameDate,
    //     status: status,
    //     questions: quizQuestion,
    //   })
    //   .execute();
    // return result.affected === 1;
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
  async whatAnswerAddingNow(playerProgressId: number) {
    const answers = await this.playerProgressRepo
      .createQueryBuilder('pp')
      .select([
        'pp.playerId',
        'playerAnswers.questionId', //не работает алиас
        'playerAnswers.answerStatus',
        'playerAnswers.addedAt',
      ])
      .leftJoin('pp.answers', 'playerAnswers')
      .where(`pp.id = :id`, { id: playerProgressId })
      .getOne();
    return answers;
  }

  async addAnswerToDb(answer: Answers) {
    return await this.answersRepository.save(answer);
  }
  async getCurrentQuestionToAnswerOnIt(playerProgressId: number) {
    const questions = await this.quizGameRepository
      .createQueryBuilder('game')
      .select(['game.questions'])
      .where(`game.firstPlayerProgressId = :id`, { id: playerProgressId })
      .orWhere(`game.secondPlayerProgressId = :id`, { id: playerProgressId })
      .getOne();
    return questions;
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
