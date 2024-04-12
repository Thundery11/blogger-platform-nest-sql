import { Injectable } from '@nestjs/common';
import {
  UserFomDb,
  UserInfoAboutHimselfModel,
  UsersOutputModel,
  allUsersOutputMapper,
  userInfoAboutHimselfMapper,
} from '../api/models/output/user-output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserCreateDto } from '../api/models/input/create-user.input.model';
import { Users } from '../domain/users.entity';

// const selectUsersConstant = ['login', 'email', 'createdAt', 'expirationDate'];
@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async createSuperadminUser(newUser: Users): Promise<Users> {
    return this.usersRepository.save(newUser);

    // const insertQuery = `INSERT INTO public."Users"(
    //   login, email, "passwordHash", "passwordSalt", "createdAt",
    //    "confirmationCode", "expirationDate", "isConfirmed")
    //   VALUES ('${userCreateDto.login}', '${userCreateDto.email}',
    //     '${userCreateDto.passwordHash}', '${userCreateDto.passwordSalt}', '${userCreateDto.createdAt}', '${userCreateDto.confirmationCode}',
    //      '${userCreateDto.expirationDate}', '${userCreateDto.isConfirmed}') RETURNING id`;
    // const newUser = await this.dataSource.query(insertQuery);
    // const userId = newUser[0].id;
    // return userId;
  }
  public async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<UsersOutputModel[]> {
    const selectQuery = `SELECT "id", "login", "email", "createdAt",
    "expirationDate" FROM public."Users" u
    WHERE u."login" ILIKE $1 OR u."email" ILIKE $2
     ORDER BY u."${sortBy}" ${sortDirection} 
     LIMIT ${pageSize} OFFSET ${skip};
     `;
    const users = await this.dataSource.query(selectQuery, [
      `%${searchLoginTerm}%`,
      `%${searchEmailTerm}%`,
    ]);
    return allUsersOutputMapper(users);
  }

  public async countDocuments(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    const selectQuery = `SELECT COUNT(*) FROM public."Users" u
    WHERE u."login" ILIKE $1 OR u."email" ILIKE $2;`;
    const result = await this.dataSource.query(selectQuery, [
      `%${searchLoginTerm}%`,
      `%${searchEmailTerm}%`,
    ]);
    const totalCount = Number(result[0].count);
    return totalCount;
    // ``
  }

  public async deleteUser(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete({ id: id });
    // const result = await this.dataSource.query(
    //   `DELETE FROM public."Users"
    // WHERE "id" = $1
    // RETURNING "id";`,
    //   [id],
    // );
    return result.affected === 1 ? true : false;
  }
  async findUserByLogin(loginOrEmail: string): Promise<Users | null> {
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .where(`u.login = :loginOrEmail`, { loginOrEmail: `${loginOrEmail}` })
      .orWhere(`u.email = :loginOrEmail`, {
        loginOrEmail: `${loginOrEmail}`,
      })
      .getOne();
    // const user = await this.usersRepository.findOne({
    //   where: { login: loginOrEmail, email: loginOrEmail },
    // });
    // const user = await this.dataSource.query(
    //   `SELECT * FROM public."Users" u
    // WHERE u."login" LIKE $1 OR u."email" LIKE $1;`,
    //   [loginOrEmail],
    // );
    if (!user) {
      return null;
    }
    return user;
  }
  async findUserById(
    currentUserId: number,
  ): Promise<UserInfoAboutHimselfModel | null> {
    const user = await this.usersRepository.findOne({
      where: { id: currentUserId },
    });
    // const user = await this.dataSource.query(
    //   `SELECT "email", "login", "id"
    // FROM public."Users" u
    // WHERE u."id" = $1`,
    //   [currentUserId],
    // );
    if (!user) {
      return null;
    }
    return userInfoAboutHimselfMapper(user);
  }
  async findUserByIdForRefreshTokens(
    currentUserId: number,
  ): Promise<Users | null> {
    const user = await this.usersRepository.findOneBy({ id: currentUserId });
    // const user = await this.dataSource.query(
    //   `SELECT *
    // FROM public."Users" u
    // WHERE u."id" = $1`,
    //   [currentUserId],
    // );
    // console.log('🚀 ~ UsersRepository ~ user:', user[0]);
    if (!user) {
      return null;
    }
    return user;
  }
  async updateConfirmationCode(
    id: number,
    confirmationCode: string,
  ): Promise<boolean> {
    const result = await this.usersRepository.update(
      { id: id },
      { confirmationCode: confirmationCode },
    );
    // const result = await this.dataSource.query(
    //   `UPDATE public."Users"
    // SET "confirmationCode" = '${confirmationCode}'
    // WHERE "id" = $1;`,
    //   [id],
    // );
    return result.affected === 1 ? true : false;
  }
  async findUserByConfirmationCode(code: string): Promise<Users | null> {
    const result = await this.usersRepository.findOne({
      where: { confirmationCode: code },
    });
    // const res = await this.dataSource.query(
    //   `SELECT * FROM public."Users" WHERE "confirmationCode" = $1`,
    //   [code],
    // );
    if (!result) return null;
    console.log(
      '🚀 ~ UsersRepository ~ findUserByConfirmationCode ~ result:',
      result,
    );

    return result;
  }
  async updateConfirmation(id: number): Promise<boolean> {
    const result = await this.usersRepository.update(
      { id: id },
      { isConfirmed: true },
    );
    // const res = await this.dataSource.query(
    //   `UPDATE public."Users" SET "isConfirmed" = 'true' WHERE "id" = $1`,
    //   [id],
    // );

    return result.affected === 1 ? true : false;
  }
}
