import { SecurityDevicesDocument } from '../../../domain/security-devices.entity';

export class SecurityDevicesOutputModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
export class SecurityDevicesFromDb {
  deviceId: string;
  userId: number;
  ip: string;
  title: string;
  lastActiveDate: string;
}

export const securityDevicesMapper = (
  securityDevice: SecurityDevicesDocument,
): SecurityDevicesOutputModel => {
  const outputModel = new SecurityDevicesOutputModel();
  outputModel.deviceId = securityDevice.deviceId;
  outputModel.ip = securityDevice.ip;
  outputModel.lastActiveDate = securityDevice.lastActiveDate;
  outputModel.title = securityDevice.title;
  return outputModel;
};

export const allSecurityDevicesMapper = (
  securityDevices: SecurityDevicesFromDb[],
): SecurityDevicesOutputModel[] => {
  const outputModel = securityDevices.map((device) => ({
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.lastActiveDate,
    deviceId: device.deviceId,
  }));
  return outputModel;
};
