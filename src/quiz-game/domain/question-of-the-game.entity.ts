import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestions } from '../../quizQuestions/domain/quiz-questions.entity';
import { Game } from './quiz-game.entity';
import { Answers } from './quiz-answers.entity';

@Entity()
export class QuestionOfTheGame {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @OneToOne(() => QuizQuestions)
  @JoinColumn()
  question: QuizQuestions;

  @Column()
  questionId: number;

  @Column()
  gameId: number;

  @ManyToOne(() => Game, (g) => g.questionOfTheGame)
  game: Game;

  // @OneToMany(()=> Answers, (a)=> a.questionOfTheGame)
  // @Column()
  // answers: Answers[]

  @OneToMany(() => Answers, (a) => a.questionOfTheGame) //one to many
  answers: Answers[]; // где должны храниться answers

  @Column()
  order: number;
}
