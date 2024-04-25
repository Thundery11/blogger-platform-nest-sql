import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../features/auth/guards/basic-auth.guard';
import { QuizQuestionsCreateModel } from './models/input/quiz-questions.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuizQuestionCommand } from '../application/use-cases/create-quiz-question-use-case';
import { DeleteQuizQuestionCommand } from '../application/use-cases/delete-quiz-question-use-case';
import { UpdateQuizQuestionCommand } from '../application/use-cases/update-quiz-question-use-case';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(private commandBus: CommandBus) {}
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
    return await this.commandBus.execute(new DeleteQuizQuestionCommand(id));
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() quizUpdateModel: QuizQuestionsCreateModel,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateQuizQuestionCommand(quizUpdateModel, id),
    );
  }
}
