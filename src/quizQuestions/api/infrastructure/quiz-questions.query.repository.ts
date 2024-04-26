import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';
import {
  QuizQuestionsOutputModel,
  allQuizQuestionOutputMapper,
} from '../models/output/quizQuestions.output.model';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(
    @InjectRepository(QuizQuestions)
    private quizQueryRepo: Repository<QuizQuestions>,
  ) {}
  async findQuestion(id: number): Promise<QuizQuestions | null> {
    return await this.quizQueryRepo.findOne({ where: { id: id } });
  }

  async getAllQuestions(
    bodySearchTerm,
    sortingByPublish,
    sortBy,
    sortDirection,
    pageSize,
    skip,
  ): Promise<QuizQuestionsOutputModel[]> {
    let searchString = `%${bodySearchTerm}%`;
    const queryBuilder = this.quizQueryRepo.createQueryBuilder('q').select('q');

    queryBuilder.where('q.body ILIKE :searchString', { searchString });

    if (sortingByPublish !== null) {
      queryBuilder.andWhere('q.published = :publishedStatus', {
        publishedStatus: sortingByPublish,
      });
    }
    const allQuestions = await queryBuilder
      .orderBy(`q.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
      .skip(skip)
      .take(pageSize)
      .getMany();
    return allQuizQuestionOutputMapper(allQuestions);
  }
}
