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

    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 9000).toISOString();

    const processGame = async (game) => {
      const { id: gameId, firstPlayerProgress, secondPlayerProgress } = game;
      const firstPlayerId = firstPlayerProgress.player.id;
      const secondPlayerId = secondPlayerProgress.player.id;
      const finalScorePoint = 1;

      const shouldEndGame = async (progress, otherProgress, progressId) => {
        if (
          progress.answers.length === 5 &&
          otherProgress.answers.length !== 5
        ) {
          const latestAddedAt = progress.answers.reduce((latest, current) =>
            new Date(latest.addedAt) > new Date(current.addedAt)
              ? latest
              : current,
          ).addedAt;

          if (new Date(latestAddedAt).toISOString() < tenSecondsAgo) {
            const res = await this.quizRepository.addPlayerScoreToDb(
              progressId,
              finalScorePoint,
            );

            await this.quizRepository.endTheGame(date.toISOString(), gameId);
            await this.quizRepository.finishPlayerProgress(progress.id);
            await this.quizRepository.finishPlayerProgress(otherProgress.id);

            return true;
          }
        }
        return false;
      };

      const gameEnded =
        (await shouldEndGame(
          firstPlayerProgress,
          secondPlayerProgress,
          firstPlayerProgress.id,
        )) ||
        (await shouldEndGame(
          secondPlayerProgress,
          firstPlayerProgress,
          secondPlayerProgress.id,
        ));

      if (gameEnded) {
        const statsForFirstPlayer =
          await this.quizQueryRepository.getTotalScore(firstPlayerId);

        const statsForSecondPlayer =
          await this.quizQueryRepository.getTotalScore(secondPlayerId);

        await this.quizRepository.setStatistcsOfUsers(
          firstPlayerId,
          statsForFirstPlayer,
        );
        await this.quizRepository.setStatistcsOfUsers(
          secondPlayerId,
          statsForSecondPlayer,
        );
      }
    };

    await Promise.all(games!.map(processGame));
    return true;
  }
}
