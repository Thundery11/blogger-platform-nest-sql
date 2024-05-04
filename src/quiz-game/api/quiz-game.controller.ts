import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../features/auth/decorators/current-user-id-param.decorator';
import { QuizGameService } from '../application/quiz-game.service';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game-query.repository';

@Controller('pair-game-quiz/pairs')
export class QuizGameController {
  constructor(
    private commandBus: CommandBus,
    private quizGameService: QuizGameService,
    private quizGameQueryRepo: QuizGameQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/connection')
  @HttpCode(HttpStatus.OK)
  async connectToTheGame(@CurrentUserId() currentUserId: number) {
    const game = await this.quizGameService.connectToTheGame(currentUserId);
    return game;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() currentUserId: number,
  ) {
    console.log('🚀 ~ QuizGameController ~ id:', id);
    const user =
      await this.quizGameQueryRepo.isUserAlreadyInGame(currentUserId);
    if (!user) {
      throw new ForbiddenException();
    }

    const game = await this.quizGameQueryRepo.findGame(id);
    console.log('🚀 ~ QuizGameController ~ game:', game);
    if (!game) {
      throw new NotFoundException();
    }
    return game;
  }
}
