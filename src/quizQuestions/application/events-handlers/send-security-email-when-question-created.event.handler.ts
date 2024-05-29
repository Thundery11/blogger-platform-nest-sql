import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QuizQuestionAddedEvent } from '../../domain/events/added-quiz-question.event';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
@EventsHandler(QuizQuestionAddedEvent)
export class SendSecuriyuEmailWhenQuizQuestionAddedHandler
  implements IEventHandler<QuizQuestionAddedEvent>
{
  constructor(private emailsManager: EmailsManager) {}
  async handle(event: QuizQuestionAddedEvent) {
    await this.emailsManager.sendEmailInfoWhenQuizQuestionAdded(
      event.quizQuestionsCreateModel,
    );
  }
}
