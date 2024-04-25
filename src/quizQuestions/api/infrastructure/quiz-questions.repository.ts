import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';
import {
  QuizQuestionsOutputModel,
  quizQuestionOutputMapper,
} from '../models/output/quizQuestions.output.model';
import { QuizQuestionsCreateModel } from '../models/input/quiz-questions.input.model';

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQuestionsRepo: Repository<QuizQuestions>,
  ) {}
  async createQuizQuestion(
    quizQuestion: QuizQuestions,
  ): Promise<QuizQuestionsOutputModel> {
    try {
      const newQuizQuestion = await this.quizQuestionsRepo.save(quizQuestion);
      return quizQuestionOutputMapper(newQuizQuestion);
    } catch (e) {
      throw e;
    }
  }
  async deleteQuizQuestion(id: number): Promise<boolean> {
    try {
      const result = await this.quizQuestionsRepo.delete({ id });
      return result.affected === 1;
    } catch (e) {
      throw new Error(`something going wrong with delete quiz question: ${e}`);
    }
  }

  async updateQuestion(
    quizUpdateModel: QuizQuestionsCreateModel,
    id: number,
    updatedAt: string,
  ): Promise<boolean> {
    try {
      const result = await this.quizQuestionsRepo.update(
        { id: id },
        {
          body: quizUpdateModel.body,
          correctAnswers: quizUpdateModel.correctAnswers,
          updatedAt: updatedAt,
        },
      );
      return result.affected === 1;
    } catch (e) {
      throw new Error(`Error in updated question ${e}`);
    }
  }
}
