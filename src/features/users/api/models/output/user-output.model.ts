import { Users } from '../../../domain/users.entity';

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
export type UserId = {
  id: number;
};
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
export const usersOutputMapper = (user: Users): UsersOutputModel => {
  const outputUser = new UsersOutputModel();
  outputUser.id = user.id.toString();
  outputUser.login = user.login;
  outputUser.email = user.email;
  outputUser.createdAt = user.createdAt;

  return outputUser;
};

// export const usersOutputMapper1 = (user: UsersDocument): UsersOutputModel => {
//   const outputModel = new UsersOutputModel();
//   outputModel.id = '12';
//   outputModel.login = user.accountData.login;
//   outputModel.email = user.accountData.email;
//   outputModel.createdAt = user.accountData.createdAt;
//   return outputModel;
// };
export const userInfoAboutHimselfMapper = (
  user: Users,
): UserInfoAboutHimselfModel => {
  const outputModel = new UserInfoAboutHimselfModel();
  outputModel.email = user.email;
  outputModel.login = user.login;
  outputModel.userId = user.id.toString();
  return outputModel;
};

export const allUsersOutputMapper = (users: Users[]): UsersOutputModel[] => {
  const allUsersOutput = users.map((user) => ({
    id: user.id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }));
  return allUsersOutput;
};
