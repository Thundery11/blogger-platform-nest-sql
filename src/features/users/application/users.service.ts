import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { Users } from '../domain/users.entity';
import bcrypt from 'bcrypt';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import {
  AllUsersOutputModel,
  UserFomDb,
  UserInfoAboutHimselfModel,
} from '../api/models/output/user-output.model';
import { SortingQueryParamsForUsers } from '../api/models/query/query-for-sorting';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { EmailResendingInputModel } from '../../auth/api/models/input/email-resending.model';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
import { sortDirectionType } from '../../../infrastucture/global-types/global-types';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private emailsManager: EmailsManager,
  ) {}

  async createSuperadminUser(userCreateModel: UserCreateModel): Promise<Users> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const confirmationCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 3,
      minutes: 3,
    }).toISOString();
    const isConfirmed = false;

    // const userCreateDto = new UserCreateDto();
    // userCreateDto.login = userCreateModel.login;
    // userCreateDto.email = userCreateModel.email;
    // userCreateDto.passwordHash = passwordHash;
    // userCreateDto.passwordSalt = passwordSalt;
    // userCreateDto.createdAt = createdAt;
    // userCreateDto.confirmationCode = confirmationCode;
    // userCreateDto.expirationDate = expirationDate;
    // userCreateDto.isConfirmed = isConfirmed;

    const newUser = new Users();
    newUser.login = userCreateModel.login;
    newUser.email = userCreateModel.email;
    newUser.passwordHash = passwordHash;
    newUser.passwordSalt = passwordSalt;
    newUser.createdAt = createdAt;
    newUser.confirmationCode = confirmationCode;
    newUser.expirationDate = expirationDate;
    newUser.isConfirmed = isConfirmed;

    return await this.usersRepository.createSuperadminUser(newUser);
  }

  async createUser(userCreateModel: UserCreateModel): Promise<Users> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const confirmationCode = uuidv4();
    console.log(
      '🚀 ~ UsersService ~ createUser ~ confirmationCode:',
      confirmationCode,
    );
    const expirationDate = add(new Date(), {
      hours: 3,
      minutes: 3,
    }).toISOString();
    const isConfirmed = false;
    const isLoginExists = await this.usersRepository.findUserByLogin(
      userCreateModel.login,
    );

    if (isLoginExists) {
      throw new BadRequestException({
        message: [
          {
            message: 'login exists',
            field: 'login',
          },
        ],
      });
    }
    const isEmailExists = await this.usersRepository.findUserByLogin(
      userCreateModel.email,
    );
    if (isEmailExists) {
      throw new BadRequestException({
        message: [
          {
            message: 'email exists',
            field: 'email',
          },
        ],
      });
    }

    // const userCreateDto = new UserCreateDto();
    // userCreateDto.login = userCreateModel.login;
    // userCreateDto.email = userCreateModel.email;
    // userCreateDto.passwordHash = passwordHash;
    // userCreateDto.passwordSalt = passwordSalt;
    // userCreateDto.createdAt = createdAt;
    // userCreateDto.confirmationCode = confirmationCode;
    // userCreateDto.expirationDate = expirationDate;
    // userCreateDto.isConfirmed = isConfirmed;

    const newUser = new Users();
    console.log('🚀 ~ UsersService ~ createUser ~ newUser:', newUser);
    newUser.login = userCreateModel.login;
    newUser.email = userCreateModel.email;
    newUser.passwordHash = passwordHash;
    newUser.passwordSalt = passwordSalt;
    newUser.createdAt = createdAt;
    newUser.confirmationCode = confirmationCode;
    newUser.expirationDate = expirationDate;
    newUser.isConfirmed = isConfirmed;
    await this.emailsManager.sendEmailConfirmationMessage(newUser);
    return await this.usersRepository.createSuperadminUser(newUser);

    // return await this.usersRepository.createSuperadminUser(userCreateDto);
  }
  async resendEmailConfirmationCode(
    emailResendingInputModel: EmailResendingInputModel,
  ): Promise<UserFomDb | null> {
    const user = await this.usersRepository.findUserByLogin(
      emailResendingInputModel.email,
    );
    if (!user) return null;
    if (user.isConfirmed === true) return null;
    if (user.isConfirmed === false) {
      const newConfirmationCode = uuidv4();
      const updateConfirmationCode =
        await this.usersRepository.updateConfirmationCode(
          user.id,
          newConfirmationCode,
        );
      console.log(
        '🚀 ~ UsersService ~ updateConfirmationCode:',
        updateConfirmationCode,
      );
      const updatedUser = await this.usersRepository.findUserByLogin(
        emailResendingInputModel.email,
      );
      if (!updatedUser) return null;
      try {
        await this.emailsManager.sendEmailConfirmationMessage(updatedUser);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    return user;
  }
  async getAllUsers(
    sortingQueryParams: SortingQueryParamsForUsers,
  ): Promise<AllUsersOutputModel> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
      searchLoginTerm = '',
      searchEmailTerm = '',
    } = sortingQueryParams;

    const skip = (Number(pageNumber) - 1) * Number(pageSize);

    const countedDocuments = await this.usersRepository.countDocuments(
      searchLoginTerm,
      searchEmailTerm,
    );

    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const users = await this.usersRepository.getAllUsers(
      sortBy,
      sortDirection,
      pageSize,
      skip,
      searchLoginTerm,
      searchEmailTerm,
    );
    const presentationalUsers = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: users,
    };
    return presentationalUsers;
  }
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
    return await this.usersRepository.findUserByLogin(loginOrEmail);
  }
  async deleteUser(id: number): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async findUserById(
    currentUserId: number,
  ): Promise<UserInfoAboutHimselfModel | null> {
    return await this.usersRepository.findUserById(currentUserId);
  }
}
