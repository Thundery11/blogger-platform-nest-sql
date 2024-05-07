import { PlayerProgress } from '../../../domain/player-progress.entity';
import { Answers, IsCorrectAnswer } from '../../../domain/quiz-answers.entity';
import { Game, GameStatus } from '../../../domain/quiz-game.entity';
export class AnswersOutputModel {
  id: string;
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
  secondPlayerProgress: PlayerProgressOutput;
  questions: QuizQuestionsOutput[];
  status: GameStatus;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string | null;
}

export const quizGameOutputModel = (game: Game) => {
  const mappedQuestions = game.questions.map((q) => ({
    id: q.id.toString(),
    body: q.body,
  }));
  const outputGame = new QuizGameOutputModel();
  outputGame.id = game.id.toString();
  outputGame.questions = mappedQuestions;
  outputGame.pairCreatedDate = game.pairCreatedDate;
  outputGame.status = game.status;
  outputGame.startGameDate = game.startGameDate;
  outputGame.finishGameDate = game.finishGameDate;

  outputGame.firstPlayerProgress = new PlayerProgressOutput();
  outputGame.firstPlayerProgress.player = new Player();
  outputGame.firstPlayerProgress.answers = game.firstPlayerProgress.answers
    ? game.firstPlayerProgress.answers.map((answer) => ({
        ...answer,
        id: answer.id.toString(),
      }))
    : [];
  outputGame.firstPlayerProgress.player.id =
    game.firstPlayerProgress.player.id.toString();
  outputGame.firstPlayerProgress.player.login =
    game.firstPlayerProgress.player.login;
  outputGame.firstPlayerProgress.score = game.firstPlayerProgress.score;
  outputGame.secondPlayerProgress = new PlayerProgressOutput();
  outputGame.secondPlayerProgress.player = new Player();
  outputGame.secondPlayerProgress.answers = game.secondPlayerProgress.answers
    ? game.firstPlayerProgress.answers.map((answer) => ({
        ...answer,
        id: answer.id.toString(),
      }))
    : [];
  outputGame.secondPlayerProgress.player.id =
    game.secondPlayerProgress.player.id.toString();
  outputGame.secondPlayerProgress.player.login =
    game.secondPlayerProgress.player.login;
  outputGame.secondPlayerProgress.score = game.secondPlayerProgress.score;
  return outputGame;
};
