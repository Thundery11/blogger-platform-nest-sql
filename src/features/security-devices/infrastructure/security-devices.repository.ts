import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';
import { Model } from 'mongoose';
import {
  SecurityDevicesOutputModel,
  allSecurityDevicesMapper,
  securityDevicesMapper,
} from '../api/models/output/security-devices-output-model';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: Model<SecurityDevices>,
  ) {}

  async addDevice(device: SecurityDevices): Promise<SecurityDevicesDocument> {
    const addedDevice = new this.securityDevicesModel(device);
    addedDevice.save();
    return addedDevice;
  }
  async getDevices(
    userId: string,
  ): Promise<SecurityDevicesOutputModel[] | null> {
    const securityDevices = await this.securityDevicesModel.find({ userId });
    if (!securityDevices) {
      return null;
    }
    return allSecurityDevicesMapper(securityDevices);
  }
  async terminateOtherSessions(deviceId: string): Promise<boolean> {
    const result = await this.securityDevicesModel.deleteMany({
      deviceId: { $ne: deviceId },
    });
    return result.deletedCount >= 1;
  }

  async getCurrentSession(
    deviceId: string,
  ): Promise<SecurityDevicesDocument | null> {
    const currentSession = await this.securityDevicesModel.findOne({
      deviceId: deviceId,
    });
    if (!currentSession) {
      return null;
    }
    return currentSession;
  }

  async deleteCurrentSession(deviceId: string): Promise<boolean> {
    const result = await this.securityDevicesModel.deleteOne({
      deviceId: deviceId,
    });
    return result.deletedCount ? true : false;
  }

  async deleteRefreshTokenWhenLogout(deviceId: string): Promise<boolean> {
    const result = await this.securityDevicesModel.deleteOne({
      deviceId,
    });
    return result.deletedCount ? true : false;
  }

  async isValidRefreshToken(
    isOkLastactiveDate: string,
  ): Promise<SecurityDevicesDocument | null> {
    return await this.securityDevicesModel.findOne({
      lastActiveDate: isOkLastactiveDate,
    });
  }
  async isValidRefreshTokenwithDevice(
    isOkLastactiveDate: string,
    deviceId1: string,
  ): Promise<SecurityDevicesDocument | null> {
    return await this.securityDevicesModel.findOne({
      $and: [
        {
          lastActiveDate: isOkLastactiveDate,
        },
        { deviceId: deviceId1 },
      ],
    });
  }
  async updateLastActiveDate(
    deviceId: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    const result = await this.securityDevicesModel.updateOne(
      { deviceId },
      { lastActiveDate },
    );
    return result.matchedCount === 1;
  }
}
