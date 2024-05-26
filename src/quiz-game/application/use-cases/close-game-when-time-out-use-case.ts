import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuizGameRepository } from '../../infrastructure/quiiz-game.repository';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';
import { Game } from '../../domain/quiz-game.entity';

export class CloseGameWhenTimeOutCommand {}

@CommandHandler(CloseGameWhenTimeOutCommand)
export class CloseGameWhenTimeOutUseCase
  implements ICommandHandler<CloseGameWhenTimeOutCommand>
{
  constructor(
    private readonly quizRepository: QuizGameRepository,
    private readonly quizQueryRepository: QuizGameQueryRepository,
  ) {}
  @Cron(CronExpression.EVERY_SECOND)
  async execute(command: CloseGameWhenTimeOutCommand) {
    const games = await this.quizQueryRepository.findNotFinishedGames();
    console.log('🚀 ~ execute ~ games:', games);

    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 9000).toISOString();
    console.log('🚀 ~ execute ~ tenSecondsAgo:', tenSecondsAgo);

    const processGame = async (game) => {
      const { firstPlayerProgress, secondPlayerProgress } = game;
      const gameId = game.id;
      const firstPlayerId = firstPlayerProgress.player.id;
      const secondPlayerId = firstPlayerProgress.player.id;
      const finalScorePoint = 1;

      const shouldEndGame = async (progress, otherProgress, progressId) => {
        console.log('🚀 ~ shouldEndGame ~ progressId:', progressId);
        if (
          progress.answers.length === 5 &&
          otherProgress.answers.length !== 5
        ) {
          const latestAddedAt = progress.answers.reduce((latest, current) => {
            return new Date(latest.addedAt) > new Date(current.addedAt)
              ? latest
              : current;
          }).addedAt;

          if (new Date(latestAddedAt).toISOString() < tenSecondsAgo) {
            console.log('🚀 ~ shouldEndGame ~ latestAddedAt:', finalScorePoint);
            console.log(
              '🚀 ~ shouldEndGame ~ otherProgress ID:',
              otherProgress.id,
            );
            const res = await this.quizRepository.addPlayerScoreToDb(
              progress.id,
              finalScorePoint,
            );
            console.log('🚀 ~ shouldEndGame ~ res:', res);
            await this.quizRepository.endTheGame(date.toISOString(), gameId);
            await this.quizRepository.finishPlayerProgress(progress.id);
            await this.quizRepository.finishPlayerProgress(otherProgress.id);
            const statsForFirstPlayer =
              await this.quizQueryRepository.getTotalScore(firstPlayerId);
            console.log(
              '🚀 ~ shouldEndGame ~ statsForFirstPlayer:',
              statsForFirstPlayer,
            );

            const statsForSecondPlayer =
              await this.quizQueryRepository.getTotalScore(secondPlayerId);
            console.log(
              '🚀 ~ shouldEndGame ~ statsForSecondPlayer:',
              statsForSecondPlayer,
            );

            await this.quizRepository.setStatistcsOfUsers(
              firstPlayerId,
              statsForFirstPlayer,
            );
            await this.quizRepository.setStatistcsOfUsers(
              secondPlayerId,
              statsForSecondPlayer,
            );
            return true;
          }
          console.log('🚀 ~ shouldEndGame ~ finalScorePoint:', finalScorePoint);
          console.log('🚀 ~ shouldEndGame ~ progressId:', progressId);
          console.log('🚀 ~ shouldEndGame ~ progressId:', progressId);
          console.log('🚀 ~ shouldEndGame ~ progressId:', progressId);
        }
        console.log('🚀 ~ shouldEndGame ~ progressId:', progressId);

        return false;
      };

      await shouldEndGame(
        firstPlayerProgress,
        secondPlayerProgress,
        firstPlayerProgress.id,
      );
      await shouldEndGame(
        secondPlayerProgress,
        firstPlayerProgress,
        secondPlayerProgress.id,
      );
    };

    await Promise.all(games!.map(processGame));
    return true;
  }
}
