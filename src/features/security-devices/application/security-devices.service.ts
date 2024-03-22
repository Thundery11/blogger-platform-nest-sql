import { Injectable } from '@nestjs/common';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';
import { ArticleParamDTO } from '../api/models/input/delete-model';

@Injectable()
export class SecurityDevicesService {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {}

  async addDevice(device: SecurityDevices): Promise<string> {
    return await this.securityDevicesRepository.addDevice(device);
  }

  async isValidRefreshToken(
    isOkLastactiveDate: string,
  ): Promise<SecurityDevicesDocument | null> {
    return await this.securityDevicesRepository.isValidRefreshToken(
      isOkLastactiveDate,
    );
  }
  async isValidRefreshTokenWithDeviceId(
    isOkLastactiveDate: string,
    deviceId1: string,
  ): Promise<SecurityDevicesDocument | null> {
    return await this.securityDevicesRepository.isValidRefreshTokenwithDevice(
      isOkLastactiveDate,
      deviceId1,
    );
  }
  async updateLastActiveDate(
    deviceId: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    return await this.securityDevicesRepository.updateLastActiveDate(
      deviceId,
      lastActiveDate,
    );
  }
}
