import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { v4 } from 'uuid';
import { SecurityDevicesService } from '../../../security-devices/application/security-devices.service';
import { SecurityDevices } from '../../../security-devices/domain/security-devices.entity';
import { LoginUserWithDeviceDto } from '../../api/models/input/login-user-with-device-dto';

export class LoginUserCommand {
  constructor(public loginUserWithDeviceDto: LoginUserWithDeviceDto) {}
}
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private authService: AuthService,
    private securityDevicesService: SecurityDevicesService,
  ) {}
  async execute(command: LoginUserCommand): Promise<any> {
    const { loginUserWithDeviceDto } = command;
    const deviceId = v4();
    const refreshToken = await this.authService.createRefreshToken(
      loginUserWithDeviceDto.user,
      deviceId,
    );
    const accessToken = await this.authService.login(
      loginUserWithDeviceDto.user,
    );
    const result = await this.authService.verifyRefreshToken(refreshToken);
    const lastActiveDate = new Date(result.iat * 1000).toISOString();
    const device = new SecurityDevices();
    device.deviceId = deviceId;
    device.ip = loginUserWithDeviceDto.ip;
    device.lastActiveDate = lastActiveDate;
    device.title = loginUserWithDeviceDto.title;
    device.userId = loginUserWithDeviceDto.user.id;

    await this.securityDevicesService.addDevice(device);

    const accesAndRefreshTokens = { refreshToken, accessToken };
    return accesAndRefreshTokens;
  }
}
