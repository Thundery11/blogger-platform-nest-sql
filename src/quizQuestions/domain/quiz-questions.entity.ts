import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuizQuestions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @Column({
    type: 'jsonb',
  })
  correctAnswers: string[];
  @Column({ default: false })
  published: boolean;
  @Column()
  createdAt: string;
  @Column({ nullable: true })
  updatedAt: string;

  // @OneToOne(() => QuestionOfTheGame) //many to many
  // @Column()
  // questionOfTheGame: QuestionOfTheGame;
}
