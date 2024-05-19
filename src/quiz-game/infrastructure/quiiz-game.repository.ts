import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../domain/quiz-game.entity';
import { Repository } from 'typeorm';
import { PlayerProgress, PlayerStatus } from '../domain/player-progress.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';
import {
  answersOutput,
  quizGameOutputModel,
} from '../api/models/output/quiz-game.output.model';
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
  //   async getQuizQuestions() {
  //   const quizQuestions = await this.quizQuestionsRepository
  //     .createQueryBuilder('qq')
  //     .select(['qq.id', 'qq.body', 'qq.correctAnswers'])
  //     .where({ published: true })
  //     .orderBy('RANDOM()')
  //     .addOrderBy('qq.addedAt', 'DESC')
  //     .take(5)
  //     .getMany();
  //   return quizQuestions;
  // }

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
        'playerAnswers.questionId',
        'playerAnswers.answerStatus',
        'playerAnswers.addedAt',
      ])
      .leftJoin('pp.answers', 'playerAnswers')
      .where(`pp.id = :id`, { id: playerProgressId })
      .getOne();

    return answers;
  }

  async addAnswerToDb(answer: Answers) {
    const addedAnswer = await this.answersRepository.save(answer);
    return answersOutput(addedAnswer);
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

  async addPlayerScoreToDb(playerProgressId: number, score: number) {
    const playerScore = await this.playerProgressRepo
      .createQueryBuilder()
      .update()
      .set({ score: () => `"score" + ${score}` })
      .where('id =:id', { id: playerProgressId })
      .execute();
    return playerScore.affected === 1;
  }
  async endTheGame(addedAt: string, gameId: number) {
    const endedGame = await this.quizGameRepository
      .createQueryBuilder('game')
      .update()
      .set({ finishGameDate: addedAt, status: GameStatus.Finished })
      // .where(`game.firstPlayerProgressId = :id`, { id: playerProgressId })
      // .orWhere(`game.secondPlayerProgressId = :id`, { id: playerProgressId })
      // .where(
      //   `(game.firstPlayerProgressId = :id OR game.secondPlayerProgressId = :id)`,
      // )
      .where(`game.id = :id`)
      .setParameters({ id: gameId })
      .execute();
    return endedGame.affected === 1;
  }
  async finishPlayerProgress(playerProgressId: number | undefined) {
    const result = await this.playerProgressRepo.update(
      { id: playerProgressId },
      { status: PlayerStatus.Finished },
    );
    return result.affected === 1;
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
