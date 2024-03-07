import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetDevicesCommand } from '../application/use-cases/get-devices-use-case';
import { SecurityDevicesOutputModel } from './models/output/security-devices-output-model';
import { DeleteAllSessionsExceptCurentCommand } from '../application/use-cases/delete-all-sessions-except-current-use-case';
import { DeleteSpecialSessionCommand } from '../application/use-cases/delete-special-session-use-case';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async getDevices(@Req() req): Promise<SecurityDevicesOutputModel[] | null> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const devices = await this.commandBus.execute(
      new GetDevicesCommand(refreshToken),
    );
    if (!devices) {
      throw new NotFoundException();
    }
    return devices;
  }

  @Delete()
  @SkipThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessionsExceptCurrent(@Req() req): Promise<boolean> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const result = await this.commandBus.execute(
      new DeleteAllSessionsExceptCurentCommand(refreshToken),
    );
    return result;
  }

  @Delete(':deviceId')
  @SkipThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpecialSession(
    @Req() req,
    @Param('deviceId') deviceId: string,
  ): Promise<boolean> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const result = await this.commandBus.execute(
      new DeleteSpecialSessionCommand(refreshToken, deviceId),
    );
    return result;
  }
}
