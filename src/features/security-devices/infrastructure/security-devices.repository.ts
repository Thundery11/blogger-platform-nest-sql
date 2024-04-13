import { Injectable } from '@nestjs/common';
import {
  SecurityDevices,
  SecurityDevicesDocument,
} from '../domain/security-devices-entity';
import {
  SecurityDevicesOutputModel,
  allSecurityDevicesMapper,
} from '../api/models/output/security-devices-output-model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ArticleParamDTO } from '../api/models/input/delete-model';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(SecurityDevices)
    private securityDevicesRepo: Repository<SecurityDevices>,
  ) {}

  async addDevice(device: SecurityDevices): Promise<string> {
    const result = await this.securityDevicesRepo.save(device);
    console.log('🚀 ~ SecurityDevicesRepository ~ addDevice ~ result:', result);
    return result.deviceId;
    //   const insertQuery = `INSERT INTO public."Devices"("deviceId", "userId", "ip", "title", "lastActiveDate")
    //  VALUES ('${device.deviceId}', '${device.userId}', '${device.ip}', '${device.title}', '${device.lastActiveDate}') RETURNING "deviceId";`;

    //   const newDevice = await this.dataSource.query(insertQuery);

    //   console.log(
    //     '🚀 ~ SecurityDevicesRepository ~ addDevice ~ newDevice:',
    //     newDevice,
    //   );
    //   const deviceId = newDevice[0].id;
    //   return deviceId;
  }
  async getDevices(
    userId: string,
  ): Promise<SecurityDevicesOutputModel[] | null> {
    const securityDevices = await this.dataSource
      .getRepository(SecurityDevices)
      .createQueryBuilder('sd')
      .where('sd.userId = :userId', { userId: userId })
      .getMany();

    // const securityDevices = await this.dataSource.query(
    //   `SELECT * FROM public."Devices"
    // WHERE "userId" = $1`,
    //   [userId],
    // );

    if (!securityDevices) {
      return null;
    }
    return allSecurityDevicesMapper(securityDevices);
  }
  async terminateOtherSessions(deviceId: string): Promise<boolean> {
    const res = await this.securityDevicesRepo
      .createQueryBuilder('sd')
      .delete()
      .where('deviceId != :deviceId', { deviceId: deviceId })
      .execute();
    // const result = await this.dataSource.query(
    //   `DELETE FROM public."Devices"
    // WHERE NOT "deviceId" = $1;`,
    //   [deviceId],
    // );
    return res.affected === 1 ? true : false;
  }

  async getCurrentSession(deviceId: string): Promise<SecurityDevices | null> {
    const currSession = await this.securityDevicesRepo.findOne({
      where: { deviceId: deviceId },
    });
    // const currentSession = await this.dataSource.query(
    //   `SELECT * FROM public."Devices"
    // WHERE "deviceId" = $1;`,
    //   [deviceId],
    // );
    if (!currSession) {
      return null;
    }
    return currSession;
  }

  async deleteCurrentSession(deviceId: string): Promise<boolean> {
    const res = await this.securityDevicesRepo.delete({ deviceId: deviceId });
    // const result = await this.dataSource.query(
    //   `DELETE FROM public."Devices"
    // WHERE "deviceId" = $1;`,
    //   [deviceId],
    // );
    return res.affected === 1 ? true : false;
  }

  async deleteRefreshTokenWhenLogout(deviceId: string): Promise<boolean> {
    const result: DeleteResult = await this.securityDevicesRepo.delete({
      deviceId: deviceId,
    });
    // const result = await this.dataSource.query(
    //   `DELETE FROM public."Devices"
    // WHERE "deviceId" = $1 RETURNING "deviceId";`,
    //   [deviceId],
    // );
    return result.affected === 1 ? true : false;
  }

  async isValidRefreshToken(
    isOkLastactiveDate: string,
  ): Promise<SecurityDevices | null> {
    const token = await this.securityDevicesRepo.findOneBy({
      lastActiveDate: isOkLastactiveDate,
    });

    // const token = await this.dataSource.query(
    //   `SELECT * FROM public."Devices" d
    // WHERE d."lastActiveDate" = $1;`,
    //   [isOkLastactiveDate],
    // );
    if (!token) return null;
    return token;
  }
  async isValidRefreshTokenwithDevice(
    isOkLastactiveDate: string,
    deviceId1: string,
  ): Promise<SecurityDevices | null> {
    const isValidToken = await this.securityDevicesRepo.findOne({
      where: { lastActiveDate: isOkLastactiveDate, deviceId: deviceId1 },
    });

    // const isValidToken = await this.dataSource
    //   .query(`SELECT * FROM public."Devices" d
    // WHERE d."lastActiveDate" = '${isOkLastactiveDate}' AND d."deviceId" = '${deviceId1}'`);
    if (!isValidToken) return null;
    return isValidToken;
  }
  async updateLastActiveDate(
    deviceId: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    const result: UpdateResult = await this.securityDevicesRepo.update(
      { deviceId: deviceId },
      { lastActiveDate: lastActiveDate },
    );
    // const res = await this.dataSource.query(
    //   `UPDATE public."Devices"
    // SET "lastActiveDate" = '${lastActiveDate}'
    // WHERE "deviceId" = $1`,
    //   [deviceId],
    // );
    // console.log('🚀 ~ SecurityDevicesRepository ~ res:', res[0]);

    return result.affected === 1 ? true : false;
  }
}
