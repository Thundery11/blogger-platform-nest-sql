// import { IsNumberStringFormat } from '../../../../features/auth/decorators/id.format.decorator';

import { IsString } from 'class-validator';

// export class IdModel {
//   @IsNumberStringFormat()
//   id: string;
// }

export class AnswerDto {
  @IsString()
  answer: string;
}
