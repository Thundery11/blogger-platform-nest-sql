import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { Users, UsersDocument, UsersModelType } from '../domain/users.entity';
import bcrypt from 'bcrypt';
import {
  UserCreateDto,
  UserCreateModel,
} from '../api/models/input/create-user.input.model';
import {
  AllUsersOutputModel,
  UserFomDb,
  UserId,
  UserInfoAboutHimselfModel,
} from '../api/models/output/user-output.model';
import { SortingQueryParamsForUsers } from '../api/models/query/query-for-sorting';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { EmailResendingInputModel } from '../../auth/api/models/input/email-resending.model';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private emailsManager: EmailsManager,

    @InjectModel(Users.name) private usersModel: UsersModelType,
  ) {}

  async createSuperadminUser(
    userCreateModel: UserCreateModel,
  ): Promise<number | null> {
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

    const userCreateDto = new UserCreateDto();
    userCreateDto.login = userCreateModel.login;
    userCreateDto.email = userCreateModel.email;
    userCreateDto.passwordHash = passwordHash;
    userCreateDto.passwordSalt = passwordSalt;
    userCreateDto.createdAt = createdAt;
    userCreateDto.confirmationCode = confirmationCode;
    userCreateDto.expirationDate = expirationDate;
    userCreateDto.isConfirmed = isConfirmed;

    const user = await this.usersRepository.createSuperadminUser(userCreateDto);
    console.log({ user: user });

    return user;
  }

  async createUser(userCreateModel: UserCreateModel): Promise<number | null> {
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

    const userCreateDto = new UserCreateDto();
    userCreateDto.login = userCreateModel.login;
    userCreateDto.email = userCreateModel.email;
    userCreateDto.passwordHash = passwordHash;
    userCreateDto.passwordSalt = passwordSalt;
    userCreateDto.createdAt = createdAt;
    userCreateDto.confirmationCode = confirmationCode;
    userCreateDto.expirationDate = expirationDate;
    userCreateDto.isConfirmed = isConfirmed;

    await this.emailsManager.sendEmailConfirmationMessage(userCreateDto);
    return await this.usersRepository.createSuperadminUser(userCreateDto);
  }
  async resendEmailConfirmationCode(
    emailResendingInputModel: EmailResendingInputModel,
  ): Promise<UserFomDb | null> {
    const user = await this.usersRepository.findUserByLogin(
      emailResendingInputModel.email,
    );
    console.log('🚀 ~ UsersService ~ user:', user);
    if (!user) return null;
    if (user.isConfirmed === true) return null;
    if (user.isConfirmed === false) {
      const newConfirmationCode = uuidv4();
      const updateConfirmationCode =
        await this.usersRepository.updateConfirmationCode(
          user.id,
          newConfirmationCode,
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

    const skip = (pageNumber - 1) * pageSize;
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
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserFomDb | null> {
    return await this.usersRepository.findUserByLogin(loginOrEmail);
  }
  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async findUserById(
    currentUserId: string,
  ): Promise<UserInfoAboutHimselfModel | null> {
    return await this.usersRepository.findUserById(currentUserId);
  }
}
