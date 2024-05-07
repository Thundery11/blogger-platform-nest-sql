import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PlayerProgress } from './player-progress.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}
@Entity()
export class Game {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @OneToOne(() => PlayerProgress)
  @JoinColumn()
  firstPlayerProgress: PlayerProgress;

  @OneToOne(() => PlayerProgress, { nullable: true })
  @JoinColumn()
  secondPlayerProgress: PlayerProgress;

  @Column('jsonb', { nullable: true })
  questions: QuizQuestions[];

  @Column({ type: 'enum', enum: GameStatus })
  status: GameStatus;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;

  static createGame(firstPlayer: PlayerProgress): Game {
    const pairCreatedDate = new Date().toISOString();
    const status = GameStatus.PendingSecondPlayer;
    const newGame = new Game();
    newGame.pairCreatedDate = pairCreatedDate;
    newGame.status = status;
    newGame.firstPlayerProgress = firstPlayer;

    return newGame;
  }
}
