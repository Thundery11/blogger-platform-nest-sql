import { UsersDocument } from '../../../../users/domain/users.entity';

export class LoginUserWithDeviceDto {
  constructor(
    public user: UsersDocument,
    public ip: string,
    public title: string,
  ) {}
}
