import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { basicConstants } from '../constants/constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    if (
      basicConstants.userName === username &&
      basicConstants.password === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
