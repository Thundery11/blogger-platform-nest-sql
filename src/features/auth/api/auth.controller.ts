import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id-param.decorator';
import { UsersService } from '../../users/application/users.service';
import { SignInModel } from './models/input/login-input.model';
import { UserInfoAboutHimselfModel } from '../../users/api/models/output/user-output.model';
import { RegistrationInputModel } from './models/input/registration-input.model';
import { BadRequestError } from 'passport-headerapikey';
import { EmailResendingInputModel } from './models/input/email-resending.model';
import { ConfirmationCodeInputModel } from './models/input/confirmation-code-input.model';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/use-cases/login-user-use-case';
import { LoginUserWithDeviceDto } from './models/input/login-user-with-device-dto';
import { RefreshTokenCommand } from '../application/use-cases/refresh-token-use-case';
import { LogoutCommand } from '../application/use-cases/logout-use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Res() response: Response) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!ip) {
      throw new NotFoundException({ message: 'unknown ip adress' });
    }
    const title = req.headers['user-agent'] || 'Mozilla';
    const user = req.user;
    console.log('🚀 ~ AuthController ~ login ~ user:', user);
    const loginUserWithDeviceDto = new LoginUserWithDeviceDto(user, ip, title);
    const accesAndRefreshTokens = await this.commandBus.execute(
      new LoginUserCommand(loginUserWithDeviceDto),
    );

    return response
      .cookie('refreshToken', accesAndRefreshTokens.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send(accesAndRefreshTokens.accessToken);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @CurrentUserId() currentUserId: number,
  ): Promise<UserInfoAboutHimselfModel | null> {
    const user = await this.usersService.findUserById(currentUserId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationInputModel: RegistrationInputModel) {
    await this.usersService.createUser(registrationInputModel);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(
    @Body() emailResendingInputModel: EmailResendingInputModel,
  ) {
    const user = await this.usersService.resendEmailConfirmationCode(
      emailResendingInputModel,
    );
    if (!user) {
      throw new BadRequestException({
        message: [
          {
            message: 'something wrong with email resending',
            field: 'email',
          },
        ],
      });
    }
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailConfirmation(
    @Body() confirmationCode: ConfirmationCodeInputModel,
  ): Promise<boolean> {
    const result = await this.authService.confirmEmail(confirmationCode.code);
    if (!result) {
      throw new BadRequestException({
        message: [
          {
            message: 'something wrong with email confirmation',
            field: 'code',
          },
        ],
      });
    }
    return true;
  }

  @SkipThrottle()
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.commandBus.execute(
      new RefreshTokenCommand(refreshToken),
    );
    return res
      .cookie('refreshToken', tokens.newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send(tokens.accessToken);
  }
  @SkipThrottle()
  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req): Promise<boolean> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const result = await this.commandBus.execute(
      new LogoutCommand(refreshToken),
    );
    return result;
  }
}
