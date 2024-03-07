export type EmailConfirmationAndInfoType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
  createdAt: string;
  passwordSalt: string;
  passwordHash: string;
};
