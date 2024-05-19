import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../../infrastructure/quiiz-game.repository';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game-query.repository';
import { AnswerDto } from '../../api/models/input/quiz-game.input.model';
import { Answers, IsCorrectAnswer } from '../../domain/quiz-answers.entity';
import { ForbiddenException } from '@nestjs/common';

export class AddAnswerCommand {
  constructor(
    public answerDto: AnswerDto,
    public playerProgressId: number,
    public gameId: number,
  ) {}
}
@CommandHandler(AddAnswerCommand)
export class AddAnswerUseCase implements ICommandHandler<AddAnswerCommand> {
  constructor(
    private quizGameRepository: QuizGameRepository,
    private quizGameQueryRepository: QuizGameQueryRepository,
  ) {}
  async execute(command: AddAnswerCommand): Promise<any> {
    const { answerDto, playerProgressId, gameId } = command;
    console.log(
      '🚀 ~ AddAnswerUseCase ~ execute ~ playerProgressId:',
      playerProgressId,
    );
    const answer = new Answers();
    const addedAt = new Date().toISOString();
    const allPossibleQuestionsFromGame =
      await this.quizGameRepository.getCurrentQuestionToAnswerOnIt(
        playerProgressId,
      );
    const whatAnswerAddingNow =
      await this.quizGameRepository.whatAnswerAddingNow(playerProgressId);

    const answerCount = whatAnswerAddingNow!.answers.length;
    if (answerCount === 5) {
      throw new ForbiddenException();
    }
    const questionIndex = Math.min(answerCount, 4); // Limiting the question index to 4

    const question = allPossibleQuestionsFromGame!.questions[questionIndex];
    const IsItCorrectAnswer = question?.correctAnswers.some(
      (q) => q === answerDto.answer,
    );

    let answerStatus;
    let score;
    const finalScorePoint = 1;
    if (IsItCorrectAnswer === true) {
      answerStatus = IsCorrectAnswer.Correct;
      score = 1;
    } else {
      answerStatus = IsCorrectAnswer.Incorrect;
      score = 0;
    }

    const questionId = question!.id;
    answer.questionId = questionId;
    answer.playerProgressId = playerProgressId;
    answer.answerStatus = answerStatus;
    answer.addedAt = addedAt;

    const addAnswerToDb = await this.quizGameRepository.addAnswerToDb(answer);
    console.log('🚀 ~ QuizGameService ~ addAnswerToDb:', addAnswerToDb);
    const addPlayerScoreToDb = await this.quizGameRepository.addPlayerScoreToDb(
      playerProgressId,
      score,
    );

    const isThatWasLastUnswer =
      await this.quizGameQueryRepository.findNotMappedGameForCurrentUser(
        playerProgressId,
      );

    const firstPlayerProgressId = isThatWasLastUnswer?.firstPlayerProgress.id;
    const secondPlayerProgressId = isThatWasLastUnswer?.secondPlayerProgress.id;

    if (
      isThatWasLastUnswer?.firstPlayerProgress.answers.length === 5 &&
      isThatWasLastUnswer?.secondPlayerProgress?.answers.length === 5
    ) {
      let addFinalPointToScore;
      const firstPlayerAnswersCount =
        isThatWasLastUnswer?.firstPlayerProgress.answers[4];
      const doesFirstPlayerHasOneCorrectAnswer =
        isThatWasLastUnswer.firstPlayerProgress.answers.some(
          (a) => a.answerStatus === IsCorrectAnswer.Correct,
        );

      const secondPlayerAnswersCount =
        isThatWasLastUnswer.secondPlayerProgress.answers[4];

      const doesSecondPlayerHasOneCorrectAnswer =
        isThatWasLastUnswer.secondPlayerProgress.answers.some(
          (a) => a.answerStatus === IsCorrectAnswer.Correct,
        );

      const firstPlayerLastAnswerDate = new Date(
        firstPlayerAnswersCount.addedAt,
      );
      const secondPlayerLastAnswerDate = new Date(
        secondPlayerAnswersCount.addedAt,
      );

      if (
        firstPlayerLastAnswerDate < secondPlayerLastAnswerDate &&
        doesFirstPlayerHasOneCorrectAnswer === true
      ) {
        addFinalPointToScore = await this.quizGameRepository.addPlayerScoreToDb(
          firstPlayerProgressId!,
          finalScorePoint,
        );
        await this.quizGameRepository.finishPlayerProgress(
          firstPlayerProgressId,
        );
        await this.quizGameRepository.finishPlayerProgress(
          secondPlayerProgressId,
        );

        await this.quizGameRepository.endTheGame(addedAt, gameId);
      } else if (
        firstPlayerLastAnswerDate > secondPlayerLastAnswerDate &&
        doesSecondPlayerHasOneCorrectAnswer === true
      ) {
        addFinalPointToScore = await this.quizGameRepository.addPlayerScoreToDb(
          secondPlayerProgressId!,
          finalScorePoint,
        );

        await this.quizGameRepository.finishPlayerProgress(
          firstPlayerProgressId,
        );
        await this.quizGameRepository.finishPlayerProgress(
          secondPlayerProgressId,
        );

        await this.quizGameRepository.endTheGame(addedAt, gameId);
      } else {
        await this.quizGameRepository.finishPlayerProgress(
          firstPlayerProgressId,
        );
        await this.quizGameRepository.finishPlayerProgress(
          secondPlayerProgressId,
        );

        await this.quizGameRepository.endTheGame(addedAt, gameId);
      }
    }
    return addAnswerToDb;
  }
}
