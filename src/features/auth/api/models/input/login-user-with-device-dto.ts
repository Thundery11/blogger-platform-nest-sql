import { UserFomDb } from '../../../../users/api/models/output/user-output.model';
import { UsersDocument } from '../../../../users/domain/users.entity';

export class LoginUserWithDeviceDto {
  constructor(
    public user: UserFomDb,
    public ip: string,
    public title: string,
  ) {}
}
