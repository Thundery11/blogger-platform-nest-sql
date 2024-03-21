import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { jwtConstants, tokensLivesConstants } from '../constants/constants';
import { v4 as uuidv4, v4 } from 'uuid';
import { UsersDocument } from '../../users/domain/users.entity';
import { UserFomDb } from '../../users/api/models/output/user-output.model';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async validateUser(loginOrEmail: string, pass: string) {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }

    const password = bcrypt.compareSync(pass, user?.passwordHash);
    if (!password) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.JWT_SECRET,
        expiresIn: tokensLivesConstants['1hour'],
      }),
    };
  }
  async createRefreshToken(user: any, deviceId: string) {
    const payload = { sub: user.id, deviceId: deviceId };
    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.REFRESH_TOKEN_SECRET,
      expiresIn: tokensLivesConstants['1hour'],
    });
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const result = await this.jwtService.verify(refreshToken, {
        secret: jwtConstants.REFRESH_TOKEN_SECRET,
      });
      console.log({ REFRESHTOKEN: result });
      if (!result) {
        throw new UnauthorizedException();
      }

      return result;
    } catch (e) {
      console.log({ verify_error: e });
    }
  }
  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.expirationDate < new Date().toISOString()) return false;
    if (user.confirmationCode !== code) return false;
    if (user.isConfirmed === true) return false;
    const result = await this.usersRepository.updateConfirmation(user.id);
    return result;
  }

  async getUserByToken(token: string) {
    try {
      const result = this.jwtService.verify(token, {
        secret: jwtConstants.JWT_SECRET,
      });

      return result.sub;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
