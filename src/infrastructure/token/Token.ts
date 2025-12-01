import { Injectable } from '@nestjs/common';
import { IToken } from './interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { appConfig } from 'src/config';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async accessToken(payload: IToken): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: appConfig.TOKEN.ACCESS_TOKEN_KEY,
      expiresIn: appConfig.TOKEN.ACCESS_TOKEN_TIME * 24 * 60 * 60,
    });
  }

  async refreshToken(payload: IToken): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: appConfig.TOKEN.REFRESH_TOKEN_KEY,
      expiresIn: appConfig.TOKEN.REFRESH_TOKEN_TIME * 24 * 60 * 60,
    });
  }

  async writeCookie(res: Response, key: string, value: string, time: number) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: time * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  async verifyToken(token: string, secretKey: string): Promise<object> {
    return this.jwt.verifyAsync(token, { secret: secretKey });
  }
}
