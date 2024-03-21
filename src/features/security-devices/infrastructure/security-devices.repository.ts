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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: Model<SecurityDevices>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async addDevice(device: SecurityDevices): Promise<SecurityDevicesDocument> {
    const insertQuery = `INSERT INTO public."Devices"("deviceId", "userId", "ip", "title", "lastActiveDate")
   VALUES ('${device.deviceId}', '${device.userId}', '${device.ip}', '${device.title}', '${device.lastActiveDate}') RETURNING "deviceId";`;
    const newDevice = await this.dataSource.query(insertQuery);
    const deviceId = newDevice[0].id;
    return deviceId;
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
    const result = await this.dataSource.query(
      `DELETE FROM public."Devices"
    WHERE "deviceId" = $1 RETURNING "deviceId";`,
      [deviceId],
    );
    return result[1] === 1 ? true : false;
  }

  async isValidRefreshToken(
    isOkLastactiveDate: string,
  ): Promise<SecurityDevicesDocument | null> {
    const token = await this.dataSource.query(
      `SELECT * FROM public."Devices" d
    WHERE d."lastActiveDate" = $1;`,
      [isOkLastactiveDate],
    );
    if (!token[0]) return null;
    return token[0];
  }
  async isValidRefreshTokenwithDevice(
    isOkLastactiveDate: string,
    deviceId1: string,
  ): Promise<SecurityDevicesDocument | null> {
    const isValidToken = await this.dataSource
      .query(`SELECT * FROM public."Devices" d
    WHERE d."lastActiveDate" = '${isOkLastactiveDate}' AND d."deviceId" = '${deviceId1}'`);
    if (!isValidToken[0]) return null;
    return isValidToken[0];
  }
  async updateLastActiveDate(
    deviceId: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    const res = await this.dataSource.query(
      `UPDATE public."Devices"
    SET "lastActiveDate" = '${lastActiveDate}' 
    WHERE "deviceId" = $1`,
      [deviceId],
    );
    return res[1] === 1 ? true : false;
  }
}
