import { use } from 'passport';
import { UsersDocument } from '../../../domain/users.entity';

export class UserFomDb {
  id: number;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
}
export class UsersOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class AllUsersOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersOutputModel[];
}
export class UserInfoAboutHimselfModel {
  email: string;
  login: string;
  userId?: string;
}
export const usersOutputMapper = (user: UserFomDb[]): UsersOutputModel => {
  const outputUser = user.map((u) => ({
    id: u.id.toString(),
    login: u.login,
    email: u.email,
    createdAt: u.createdAt,
  }))[0];

  return outputUser;
};

export const usersOutputMapper1 = (user: UsersDocument): UsersOutputModel => {
  const outputModel = new UsersOutputModel();
  outputModel.id = '12';
  outputModel.login = user.accountData.login;
  outputModel.email = user.accountData.email;
  outputModel.createdAt = user.accountData.createdAt;
  return outputModel;
};
export const userInfoAboutHimselfMapper = (
  user: UsersDocument,
): UserInfoAboutHimselfModel => {
  const outputModel = new UserInfoAboutHimselfModel();
  outputModel.email = user.accountData.email;
  outputModel.login = user.accountData.login;
  outputModel.userId = user._id.toString();
  return outputModel;
};

export const allUsersOutputMapper = (
  users: UsersDocument[],
): UsersOutputModel[] => {
  const allUsersOutput = users.map((user) => ({
    id: '10',
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }));
  return allUsersOutput;
};
