import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class SecurityDevices {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  ip: string;
  @Column('uuid')
  deviceId: string;
  @Column()
  lastActiveDate: string;
  @Column()
  title: string;
  @Column()
  userId: number;
  @ManyToOne(() => Users, (u) => u.securityDevices)
  user: Users;
}

@Schema()
export class SecurityDevicess {
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
