import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  ManyToOne,
} from 'typeorm';
import { PlayerProgress } from './player-progress.entity';
import { QuestionOfTheGame } from './question-of-the-game.entity';

export enum IsCorrectAnswer {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

@Entity()
export class Answers {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  questionOfTheGameId: number;

  @ManyToOne(() => QuestionOfTheGame, (q) => q.answers)
  questionOfTheGame: QuestionOfTheGame;

  @Column()
  playerProgressId: number;

  @ManyToOne(() => PlayerProgress, (p) => p.answers)
  playerProgress: PlayerProgress;

  @Column({ type: 'enum', enum: IsCorrectAnswer })
  answerStatus: IsCorrectAnswer;

  @Column()
  addedAt: string;
  // @ManyToOne(()=> QuestionOfTheGame, (q)=> q.answers)
  // @Column()
  // questionOfTheGame: QuestionOfTheGame
}
