import { UserFomDb } from '../../../../users/api/models/output/user-output.model';

export class LoginUserWithDeviceDto {
  constructor(
    public user: UserFomDb,
    public ip: string,
    public title: string,
  ) {}
}
