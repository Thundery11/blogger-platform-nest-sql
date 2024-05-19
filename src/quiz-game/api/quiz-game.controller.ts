import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../features/auth/decorators/current-user-id-param.decorator';
import { QuizGameService } from '../application/quiz-game.service';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game-query.repository';
import { AnswerDto } from './models/input/quiz-game.input.model';
import { ConnectToTheGameCommand } from '../application/use-cases/connect-to-the-game.use-case';
import { AddAnswerCommand } from '../application/use-cases/add-answer.use-case';

@Controller('pair-game-quiz/pairs')
export class QuizGameController {
  constructor(
    private commandBus: CommandBus,
    private quizGameService: QuizGameService,
    private quizGameQueryRepo: QuizGameQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/my-current')
  @HttpCode(HttpStatus.OK)
  async getMyCurrentGame(@CurrentUserId() currentUserId: number) {
    const user =
      await this.quizGameQueryRepo.isUserAlreadyInGame(currentUserId);

    if (!user) {
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }
    const game = await this.quizGameQueryRepo.findGameForCurrentUser(user.id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    if (game.finishGameDate !== null) {
      throw new NotFoundException();
    }
    return game;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/connection')
  @HttpCode(HttpStatus.OK)
  async connectToTheGame(@CurrentUserId() currentUserId: number) {
    const game = await this.commandBus.execute(
      new ConnectToTheGameCommand(currentUserId),
    );
    return game;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/my-current/answers')
  @HttpCode(HttpStatus.OK)
  async sendAnswer(
    @CurrentUserId() currentUserId: number,
    @Body() answerDto: AnswerDto,
  ) {
    const user =
      await this.quizGameQueryRepo.isUserAlreadyInGame(currentUserId);
    if (!user) {
      throw new ForbiddenException();
    }
    const isGameStarted = await this.quizGameQueryRepo.isGameStarted(user.id);
    if (!isGameStarted) {
      throw new ForbiddenException('The game doesnt start yet');
    }
    const gameId = isGameStarted.id;
    const answerStatus = await this.commandBus.execute(
      new AddAnswerCommand(answerDto, user.id, gameId),
    );
    return answerStatus;
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() currentUserId: number,
  ) {
    const game = await this.quizGameQueryRepo.findGame(id);
    if (!game) {
      throw new NotFoundException();
    }

    //тут исправить назад если что
    const user = await this.quizGameQueryRepo.findGameById(currentUserId);
    if (!user) {
      throw new ForbiddenException();
    }
    return game;
  }
}
