import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class SecurityDevices {
  @Prop({ required: true })
  userId: number;
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  lastActiveDate: string;
  @Prop({ required: true })
  deviceId: string;
}
export type SecurityDevicesDocument = HydratedDocument<SecurityDevices>;
export const SecurityDevicesSchema =
  SchemaFactory.createForClass(SecurityDevices);
