import { Injectable } from '@nestjs/common';
import { Users } from '../../features/users/domain/users.entity';
import { EmailAdapter } from '../adapters/email-adapter';
import { UserCreateDto } from '../../features/users/api/models/input/create-user.input.model';
import { QuizQuestionsCreateModel } from '../../quizQuestions/api/models/input/quiz-questions.input.model';
@Injectable()
export class EmailsManager {
  constructor(private emailAdapter: EmailAdapter) {}
  async sendEmailConfirmationMessage(userCreateDto: Users) {
    const message = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href='https://somesite.com/confirm-email?code=${userCreateDto.confirmationCode}'>complete registration</a> </p>`;
    await this.emailAdapter.sendEmail(userCreateDto.email, message);
  }
  async sendEmailInfoWhenQuizQuestionAdded(
    quizQuestionsCreateModel: QuizQuestionsCreateModel,
  ) {
    const email = 'ilb9.nizovtsov@gmail.com';
    const message = `<h1>Thank for added new quiz question</h1><p>To finish registration please follow the link below:<a href='https://somesite.com/confirm-email?code=${quizQuestionsCreateModel.body}'>complete registration</a> </p>`;
    await this.emailAdapter.sendEmail(email, message);
  }
  //   async sendPasswordRecoveryCode(
  //     recoveryCodeForNewPassword: RecoveryCodeForNewPasswordType
  //   ) {
  //     const message = ` <h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCodeForNewPassword.recoveryCode}'>recovery password</a></p>`;
  //     await emailAdapter.sendEmail(recoveryCodeForNewPassword.email, message);
  //   },
}
