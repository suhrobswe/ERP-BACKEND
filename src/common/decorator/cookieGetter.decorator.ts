import {
  BadRequestException,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    try {
      const request = context.switchToHttp().getRequest();
      const refreshToken = request.cookies[data];
      // console.log('CookieGetter', data, request.cookies);
      if (!refreshToken) {
        throw new HttpException('Authorization error', 401);
      }
      return refreshToken;
    } catch (error) {
      throw error;
    }
  },
);
