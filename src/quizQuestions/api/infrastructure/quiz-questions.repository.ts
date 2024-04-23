import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';
import {
  QuizQuestionsOutputModel,
  quizQuestionOutputMapper,
} from '../models/output/quizQuestions.output.model';

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQuestionsRepo: Repository<QuizQuestions>,
  ) {}
  public async createQuizQuestion(
    quizQuestion: QuizQuestions,
  ): Promise<QuizQuestionsOutputModel> {
    try {
      const newQuizQuestion = await this.quizQuestionsRepo.save(quizQuestion);
      return quizQuestionOutputMapper(newQuizQuestion);
    } catch (e) {
      throw e;
    }
  }
  public async deleteQuizQuestion(id: number): Promise<boolean> {
    try {
      const result = await this.quizQuestionsRepo.delete({ id });
      return result.affected === 1;
    } catch (e) {
      throw new Error(`something going wrong with delete quiz question: ${e}`);
    }
  }
}
