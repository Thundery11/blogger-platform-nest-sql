import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../features/auth/guards/basic-auth.guard';
import {
  PublishQuestionUpdateModel,
  QuizQuestionsCreateModel,
  SortingQueryParamsForQuiz,
} from './models/input/quiz-questions.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuizQuestionCommand } from '../application/use-cases/create-quiz-question-use-case';
import { DeleteQuizQuestionCommand } from '../application/use-cases/delete-quiz-question-use-case';
import { UpdateQuizQuestionCommand } from '../application/use-cases/update-quiz-question-use-case';
import { PublishQuestionCommand } from '../application/use-cases/publish-question-use-case';
import { QuizQuestionsQueryRepository } from './infrastructure/quiz-questions.query.repository';
import { FindAllQuestionsCommand } from '../application/use-cases/get-all-quiz-questions-use-case';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(
    private commandBus: CommandBus,
    private quizQueryRepo: QuizQuestionsQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Body() quizQuestionsCreateModel: QuizQuestionsCreateModel,
  ) {
    const quizQuestion = await this.commandBus.execute(
      new CreateQuizQuestionCommand(quizQuestionsCreateModel),
    );
    return quizQuestion;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const isQuestionExist = await this.quizQueryRepo.findQuestion(id);
    if (!isQuestionExist) {
      throw new NotFoundException();
    }
    return await this.commandBus.execute(new DeleteQuizQuestionCommand(id));
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() quizUpdateModel: QuizQuestionsCreateModel,
  ): Promise<boolean> {
    const isQuestionExist = await this.quizQueryRepo.findQuestion(id);
    if (!isQuestionExist) {
      throw new NotFoundException();
    }
    return await this.commandBus.execute(
      new UpdateQuizQuestionCommand(quizUpdateModel, id),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() publishQuestionUpdateModel: PublishQuestionUpdateModel,
  ): Promise<boolean> {
    const isQuestionExist = await this.quizQueryRepo.findQuestion(id);

    if (!isQuestionExist) {
      throw new NotFoundException('Question not found');
    }
    return await this.commandBus.execute(
      new PublishQuestionCommand(id, publishQuestionUpdateModel),
    );
    //нужно ли изменять updatedAt при этом запросе???
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllQuestions(
    @Query() sortingQueryParamsForQuiz: SortingQueryParamsForQuiz,
  ) {
    return await this.commandBus.execute(
      new FindAllQuestionsCommand(sortingQueryParamsForQuiz),
    );
  }
}
