import { PlayerProgress } from '../../../domain/player-progress.entity';
import { Answers, IsCorrectAnswer } from '../../../domain/quiz-answers.entity';
import { Game, GameStatus } from '../../../domain/quiz-game.entity';
export class AnswersOutputModel {
  questionId: string;
  answerStatus: IsCorrectAnswer;
  addedAt: string;
}

export class Player {
  id: string;
  login: string;
}
export class QuizQuestionsOutput {
  id: string;
  body: string;
}
export class PlayerProgressOutput {
  player: Player;
  score: number;
  answers: AnswersOutputModel[];
}
export class QuizGameOutputModel {
  id: string;
  firstPlayerProgress: PlayerProgressOutput;
  secondPlayerProgress: PlayerProgressOutput | null;
  questions: QuizQuestionsOutput[];
  status: GameStatus;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string | null;
}

export class AnswersOutput {
  questionId: string;
  answerStatus: IsCorrectAnswer;
  addedAt: string;
}

class PlayerPgrogressIdsInTheGame {
  firstPlayerProgressId: number;
  secondPlayerProgressId: number;
}

export const getPlayerProgressId = (game: Game) => {
  const output = new PlayerPgrogressIdsInTheGame();
  output.firstPlayerProgressId = game.firstPlayerProgress.id;
  output.secondPlayerProgressId = game.secondPlayerProgress.id;
  return output;
};

export const quizGameOutputModel = (game: Game) => {
  let mappedQuestions;
  if (game.questions) {
    mappedQuestions = game.questions.map((q) => ({
      id: q.id.toString(),
      body: q.body,
    }));
  }

  const outputGame = new QuizGameOutputModel();
  outputGame.id = game.id.toString();
  outputGame.questions = mappedQuestions ?? null;
  outputGame.pairCreatedDate = game.pairCreatedDate;
  outputGame.status = game.status;
  outputGame.startGameDate = game.startGameDate;
  outputGame.finishGameDate = game.finishGameDate;

  outputGame.firstPlayerProgress = new PlayerProgressOutput();
  outputGame.firstPlayerProgress.player = new Player();
  outputGame.firstPlayerProgress.answers = game.firstPlayerProgress.answers
    ? game.firstPlayerProgress.answers.map((answer) => ({
        ...answer,
        questionId: answer.questionId.toString(),
      }))
    : [];
  outputGame.firstPlayerProgress.player.id =
    game.firstPlayerProgress.player.id.toString();
  outputGame.firstPlayerProgress.player.login =
    game.firstPlayerProgress.player.login;
  outputGame.firstPlayerProgress.score = game.firstPlayerProgress.score;
  outputGame.secondPlayerProgress = new PlayerProgressOutput();
  if (game.secondPlayerProgress) {
    outputGame.secondPlayerProgress.player = new Player();
    outputGame.secondPlayerProgress.answers = game.secondPlayerProgress.answers
      ? game.secondPlayerProgress.answers.map((answer) => ({
          ...answer,
          questionId: answer.questionId.toString(),
        }))
      : [];
    outputGame.secondPlayerProgress.player.id =
      game.secondPlayerProgress.player.id.toString();
    outputGame.secondPlayerProgress.player.login =
      game.secondPlayerProgress.player.login;
    outputGame.secondPlayerProgress.score = game.secondPlayerProgress.score;
  } else {
    outputGame.secondPlayerProgress = null;
  }
  return outputGame;
};

export const answersOutput = (answer: Answers) => {
  const output = new AnswersOutput();
  output.questionId = answer.questionId.toString();
  output.answerStatus = answer.answerStatus;
  output.addedAt = answer.addedAt;
  return output;
};
