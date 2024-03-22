import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/application/auth.service';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityDevicesService } from '../security-devices.service';
import { UUID } from 'crypto';
import { ArticleParamDTO } from '../../api/models/input/delete-model';
export class DeleteSpecialSessionCommand {
  constructor(
    public refreshToken: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSpecialSessionCommand)
export class DeleteSpecialSessionUseCase
  implements ICommandHandler<DeleteSpecialSessionCommand>
{
  constructor(
    private authService: AuthService,
    private securityDevicesRepo: SecurityDevicesRepository,
    private securityDevicesServise: SecurityDevicesService,
  ) {}
  async execute(command: DeleteSpecialSessionCommand): Promise<boolean> {
    const { refreshToken, deviceId } = command;
    const payload = await this.authService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException();
    }
    const userId = payload.sub;

    const lastActiveDate = new Date(payload.iat * 1000).toISOString();

    const isValidRefreshToken =
      await this.securityDevicesServise.isValidRefreshToken(lastActiveDate);

    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }
    const deviceSession =
      await this.securityDevicesRepo.getCurrentSession(deviceId);
    if (!deviceSession) {
      throw new NotFoundException();
    }
    if (userId !== deviceSession.userId) {
      throw new ForbiddenException();
    }

    const isUpdatedTOken = await this.securityDevicesRepo.updateLastActiveDate(
      deviceId,
      lastActiveDate,
    );
    const deletedSession =
      await this.securityDevicesRepo.deleteCurrentSession(deviceId);
    if (!deletedSession) {
      throw new UnauthorizedException();
    }
    return deletedSession;
  }
}
