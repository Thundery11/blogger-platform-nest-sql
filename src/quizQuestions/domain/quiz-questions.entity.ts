import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// type CorrectAnswers ={
//   correctAnswers: string[];
// }

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
}
