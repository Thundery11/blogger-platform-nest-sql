import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestionAddedEvent } from './events/added-quiz-question.event';
import { QuizQuestionsCreateModel } from '../api/models/input/quiz-questions.input.model';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity()
export class QuizQuestions extends AggregateRoot {
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

  static addQuizQuestion(quizQuestionsCreateModel: QuizQuestionsCreateModel) {
    const published = false;
    const createdAt = new Date().toISOString();
    const quizQuestion = new QuizQuestions();
    quizQuestion.body = quizQuestionsCreateModel.body;
    quizQuestion.correctAnswers = quizQuestionsCreateModel.correctAnswers;
    quizQuestion.createdAt = createdAt;
    quizQuestion.published = published;

    quizQuestion.apply(new QuizQuestionAddedEvent(quizQuestionsCreateModel));

    return quizQuestion;
  }
}
