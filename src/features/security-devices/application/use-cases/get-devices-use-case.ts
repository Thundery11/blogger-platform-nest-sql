import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';
import { SecurityDevicesOutputModel } from '../../api/models/output/security-devices-output-model';
import { UnauthorizedException } from '@nestjs/common';

export class GetDevicesCommand {
  constructor(public refreshToken: string) {}
}
@CommandHandler(GetDevicesCommand)
export class GetDevicesUseCase implements ICommandHandler<GetDevicesCommand> {
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(
    command: GetDevicesCommand,
  ): Promise<SecurityDevicesOutputModel[] | null> {
    const payload = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();
    const isValidRefreshToken =
      await this.securityDevicesRepo.isValidRefreshToken(lastActiveDate);
    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }
    const userId = payload.sub;
    const devices = await this.securityDevicesRepo.getDevices(userId);
    return devices;
  }
}
