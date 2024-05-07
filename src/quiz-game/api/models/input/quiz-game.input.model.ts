import { IsNumberStringFormat } from '../../../../features/auth/decorators/id.format.decorator';

export class IdModel {
  @IsNumberStringFormat()
  id: string;
}
