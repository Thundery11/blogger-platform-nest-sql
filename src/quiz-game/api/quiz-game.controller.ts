import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../features/auth/decorators/current-user-id-param.decorator';
import { QuizGameService } from '../application/quiz-game.service';

@Controller('pair-game-quiz/pairs')
export class QuizGameController {
  constructor(
    private commandBus: CommandBus,
    private quizGameService: QuizGameService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/connection')
  @HttpCode(HttpStatus.OK)
  async connectToTheGame(@CurrentUserId() currentUserId: number) {
    console.log(
      '🚀 ~ QuizGameController ~ connectToTheGame ~ currentUserId:',
      currentUserId,
    );
    const game = await this.quizGameService.connectToTheGame(currentUserId);
    return game;
  }
}
