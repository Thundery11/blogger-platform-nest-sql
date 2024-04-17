import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { EmailConfirmationAndInfoType } from '../api/models/input/email-confirmationType';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LikesForPosts } from '../../likes/domain/likes-for-posts.entity';
import { LastLiked } from '../../likes/domain/last-liked.entity';
import { Comments } from '../../comments/domain/comments.entity';
import { SecurityDevices } from '../../security-devices/domain/security-devices.entity';

// export type UsersDocument = HydratedDocument<Users>;
// export type UsersModelType = Model<UsersDocument> & typeof statics;

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  passwordSalt: string;
  @Column()
  createdAt: string;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: string;
  @Column()
  isConfirmed: boolean;
  @OneToMany(() => LikesForPosts, (lp) => lp.user)
  likesForPosts: LikesForPosts[];
  @OneToMany(() => LastLiked, (ll) => ll.user)
  lastLiked: LastLiked[];
  @OneToMany(() => Comments, (c) => c.user)
  comments: Comments[];
  @OneToMany(() => SecurityDevices, (s) => s.user)
  securityDevices: SecurityDevices[];
}

// @Schema({ _id: false })
// export class AccountDataOfUsers {
//   @Prop({ required: true })
//   login: string;
//   @Prop({ required: true })
//   email: string;
//   @Prop({ required: true })
//   passwordHash: string;
//   @Prop({ required: true })
//   passwordSalt: string;
//   @Prop({ required: true })
//   createdAt: string;
// }
// const AccountDataOfUsersSchema =
//   SchemaFactory.createForClass(AccountDataOfUsers);

// @Schema({ _id: false })
// export class UsersEmailConfirmation {
//   @Prop({ required: true })
//   confirmationCode: string;
//   @Prop({ required: true })
//   expirationDate: Date;
//   @Prop({ required: true })
//   isConfirmed: boolean;
// }
// const UsersEmailConfirmationSchema = SchemaFactory.createForClass(
//   UsersEmailConfirmation,
// );

// @Schema()
// export class Userss {
//   @Prop({ required: true, type: AccountDataOfUsersSchema })
//   accountData: AccountDataOfUsers;
//   @Prop({ required: true, type: UsersEmailConfirmationSchema })
//   emailConfirmation: UsersEmailConfirmation;

//   static createUser(
//     usersCreateModel: UserCreateModel,
//     emailConfirmationAndInfo: EmailConfirmationAndInfoType,
//   ) {
//     const accountData = new AccountDataOfUsers();
//     accountData.login = usersCreateModel.login;
//     accountData.email = usersCreateModel.email;
//     accountData.passwordHash = emailConfirmationAndInfo.passwordHash;
//     accountData.passwordSalt = emailConfirmationAndInfo.passwordSalt;
//     accountData.createdAt = emailConfirmationAndInfo.createdAt;

//     const emailConfirmation = new UsersEmailConfirmation();
//     emailConfirmation.confirmationCode =
//       emailConfirmationAndInfo.confirmationCode;
//     emailConfirmation.expirationDate = emailConfirmationAndInfo.expirationDate;
//     emailConfirmation.isConfirmed = emailConfirmationAndInfo.isConfirmed;

//     const user = new this();
//     user.accountData = accountData;
//     user.emailConfirmation = emailConfirmation;

//     return user;
//   }
// }

// export const UsersSchema = SchemaFactory.createForClass(Users);
// const statics = {
//   createUser: Userss.createUser,
// };
// UsersSchema.statics = statics;
