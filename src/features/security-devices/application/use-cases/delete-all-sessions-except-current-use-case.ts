import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';
import { UnauthorizedException } from '@nestjs/common';

export class DeleteAllSessionsExceptCurentCommand {
  constructor(public refreshToken: string) {}
}
@CommandHandler(DeleteAllSessionsExceptCurentCommand)
export class DeleteAllSessionsExceptCurentUseCase
  implements ICommandHandler<DeleteAllSessionsExceptCurentCommand>
{
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
  ) {}
  async execute(
    command: DeleteAllSessionsExceptCurentCommand,
  ): Promise<boolean> {
    const payload = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }
    const deviceId = payload.deviceId;
    const deletedDevices =
      await this.securityDevicesRepo.terminateOtherSessions(deviceId);
    return deletedDevices;
  }
}
