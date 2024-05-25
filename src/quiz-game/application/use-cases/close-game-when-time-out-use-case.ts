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
  //   //   @Cron(CronExpression.EVERY_SECOND)
  //   async execute(command: CloseGameWhenTimeOutCommand) {
  //     const games = await this.quizQueryRepository.findNotFinishedGames();
  //     console.log('🚀 ~ execute ~ games:', games);
  //     const date = new Date();
  //     const tenSecondsAgo = new Date(date.getTime() - 10000).toISOString();
  //     console.log('🚀 ~ execute ~ tenSecondsAgo:', tenSecondsAgo);

  //     games?.forEach(async (game) => {
  //       const { firstPlayerProgress, secondPlayerProgress } = game;
  //       const firstPlayerProgressId = firstPlayerProgress.id;
  //       const secondPlayerProgressId = secondPlayerProgress.id;
  //       const gameId = game.id;
  //       if (firstPlayerProgress.answers.length === 5) {
  //         if (secondPlayerProgress.answers.length !== 5) {
  //           const latestAddedAt = secondPlayerProgress.answers.reduce(
  //             (latest, current) => {
  //               return new Date(latest.addedAt) > new Date(current.addedAt)
  //                 ? latest
  //                 : current;
  //             },
  //           );
  //           if (latestAddedAt.addedAt > tenSecondsAgo) {
  //             const res = await this.quizRepository.addPlayerScoreToDb(
  //               firstPlayerProgressId,
  //               1,
  //             );
  //             console.log('🚀 ~ games?.forEach ~ res:', res);
  //             await this.quizRepository.endTheGame(date.toISOString(), gameId);
  //           }
  //           console.log('🚀 ~ games?.forEach ~ latestAddedAt:', latestAddedAt);
  //         }
  //       }
  //       if (secondPlayerProgress.answers.length === 5) {
  //         if (firstPlayerProgress.answers.length !== 5) {
  //           const latestAddedAt = firstPlayerProgress.answers.reduce(
  //             (latest, current) => {
  //               return new Date(latest.addedAt) > new Date(current.addedAt)
  //                 ? latest
  //                 : current;
  //             },
  //           );
  //           if (latestAddedAt.addedAt > tenSecondsAgo) {
  //             const res = await this.quizRepository.addPlayerScoreToDb(
  //               secondPlayerProgressId,
  //               1,
  //             );
  //             console.log('🚀 ~ games?.forEach ~ res:', res);
  //             await this.quizRepository.endTheGame(date.toISOString(), gameId);
  //           }
  //           console.log('🚀 ~ games?.forEach ~ latestAddedAt:', latestAddedAt);
  //         }
  //       }
  //     });
  //     return true;
  //   }
  @Cron(CronExpression.EVERY_SECOND)
  async execute(command: CloseGameWhenTimeOutCommand) {
    const games = await this.quizQueryRepository.findNotFinishedGames();
    console.log('🚀 ~ execute ~ games:', games);

    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 10000).toISOString();
    console.log('🚀 ~ execute ~ tenSecondsAgo:', tenSecondsAgo);

    const processGame = async (game) => {
      const { firstPlayerProgress, secondPlayerProgress } = game;
      const gameId = game.id;

      const shouldEndGame = async (progress, otherProgress, progressId) => {
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
            const res = await this.quizRepository.addPlayerScoreToDb(
              progressId,
              1,
            );
            console.log('🚀 ~ shouldEndGame ~ res:', res);
            await this.quizRepository.endTheGame(date.toISOString(), gameId);
            return true;
          }
          console.log('🚀 ~ shouldEndGame ~ latestAddedAt:', latestAddedAt);
        }
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
