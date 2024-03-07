import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { Users, UsersDocument, UsersModelType } from '../domain/users.entity';
import bcrypt from 'bcrypt';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import {
  AllUsersOutputModel,
  UserInfoAboutHimselfModel,
} from '../api/models/output/user-output.model';
import { SortingQueryParamsForUsers } from '../api/models/query/query-for-sorting';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { EmailResendingInputModel } from '../../auth/api/models/input/email-resending.model';
import { EmailsManager } from '../../../infrastucture/managers/emails-manager';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private emailsManager: EmailsManager,
    @InjectModel(Users.name) private usersModel: UsersModelType,
  ) {}

  async createSuperadminUser(
    userCreateModel: UserCreateModel,
  ): Promise<UsersDocument> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const emailConfirmationAndInfo = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 3,
        minutes: 3,
      }),
      isConfirmed: false,
      createdAt,
      passwordSalt,
      passwordHash,
    };
    const user = this.usersModel.createUser(
      userCreateModel,
      emailConfirmationAndInfo,
    );
    return await this.usersRepository.createSuperadminUser(user);
  }

  async createUser(
    userCreateModel: UserCreateModel,
  ): Promise<UsersDocument | null> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      userCreateModel.password,
      passwordSalt,
    );
    const emailConfirmationAndInfo = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 3,
        minutes: 3,
      }),
      isConfirmed: false,
      createdAt,
      passwordSalt,
      passwordHash,
    };
    console.log(
      'Confirmation code: ',
      emailConfirmationAndInfo.confirmationCode,
    );
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

    const user = this.usersModel.createUser(
      userCreateModel,
      emailConfirmationAndInfo,
    );

    await this.emailsManager.sendEmailConfirmationMessage(user);
    return await this.usersRepository.createSuperadminUser(user);
  }
  async resendEmailConfirmationCode(
    emailResendingInputModel: EmailResendingInputModel,
  ): Promise<UsersDocument | null> {
    const user = await this.usersRepository.findUserByLogin(
      emailResendingInputModel.email,
    );
    if (!user) return null;
    if (user.emailConfirmation.isConfirmed === true) return null;
    if (user.emailConfirmation.isConfirmed === false) {
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
  ): Promise<UsersDocument | null> {
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
