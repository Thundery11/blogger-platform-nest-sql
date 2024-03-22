import { Injectable } from '@nestjs/common';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';
import {
  SecurityDevicesOutputModel,
  allSecurityDevicesMapper,
} from '../api/models/output/security-devices-output-model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArticleParamDTO } from '../api/models/input/delete-model';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async addDevice(device: SecurityDevices): Promise<string> {
    const insertQuery = `INSERT INTO public."Devices"("deviceId", "userId", "ip", "title", "lastActiveDate")
   VALUES ('${device.deviceId}', '${device.userId}', '${device.ip}', '${device.title}', '${device.lastActiveDate}') RETURNING "deviceId";`;

    const newDevice = await this.dataSource.query(insertQuery);

    console.log(
      '🚀 ~ SecurityDevicesRepository ~ addDevice ~ newDevice:',
      newDevice,
    );
    const deviceId = newDevice[0].id;
    return deviceId;
  }
  async getDevices(
    userId: string,
  ): Promise<SecurityDevicesOutputModel[] | null> {
    const securityDevices = await this.dataSource.query(
      `SELECT * FROM public."Devices" 
    WHERE "userId" = $1`,
      [userId],
    );

    if (!securityDevices) {
      return null;
    }
    return allSecurityDevicesMapper(securityDevices);
  }
  async terminateOtherSessions(deviceId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Devices"
    WHERE NOT "deviceId" = $1;`,
      [deviceId],
    );
    return result[1] === 1 ? true : false;
  }

  async getCurrentSession(
    deviceId: string,
  ): Promise<SecurityDevicesDocument | null> {
    const currentSession = await this.dataSource.query(
      `SELECT * FROM public."Devices" 
    WHERE "deviceId" = $1;`,
      [deviceId],
    );
    if (!currentSession) {
      return null;
    }
    return currentSession[0];
  }

  async deleteCurrentSession(deviceId: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Devices"
    WHERE "deviceId" = $1;`,
      [deviceId],
    );
    return result[1] === 1 ? true : false;
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
    console.log('🚀 ~ SecurityDevicesRepository ~ res:', res[0]);

    return res[1] === 1 ? true : false;
  }
}
