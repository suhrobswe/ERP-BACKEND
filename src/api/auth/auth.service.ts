import {
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { SigninDto } from 'src/common/dto/signin.dto';
import { Roles } from 'src/common/enum/roles.enum';
import { appConfig } from 'src/config';
import { AdminEntity, TeacherEntity } from 'src/core';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { successRes } from 'src/infrastructure/response/success.response';
import { IToken } from 'src/infrastructure/token/interface';
import { TokenService } from 'src/infrastructure/token/Token';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {}

  async signin(dto: SigninDto, res: Response) {
    const { username, password } = dto;
    if (dto.role == 'Admin') {
      const admin = await this.adminRepo.findOne({
        where: { username, isActive: true, isDeleted: false },
      });
      console.log(admin);

      const isMatchPassword = await this.crypto.decrypt(
        password,
        admin?.password || '',
      );
      if (!admin || !isMatchPassword)
        throw new HttpException('Username or password is incorrect', 400);

      const payload: IToken = {
        id: admin.id,
        isActive: admin.isActive,
        role: admin.role,
      };
      const accessToken = await this.tokenService.accessToken(payload);
      const refreshToken = await this.tokenService.refreshToken(payload);
      await this.tokenService.writeCookie(res, 'adminToken', refreshToken, 30);

      return successRes({
        token: accessToken,
        user: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          role: Roles.ADMIN,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
      });
    }
    if (dto.role == 'Teacher') {
      const teacher = await this.teacherRepo.findOne({
        where: { username, isActive: true, isDeleted: false },
      });

      const isMatchPassword = await this.crypto.decrypt(
        password,
        teacher?.password || '',
      );
      if (!teacher || !isMatchPassword)
        throw new HttpException('Username or password is incorrect', 400);

      const payload: IToken = {
        id: teacher.id,
        isActive: teacher.isActive,
        role: teacher.role,
      };
      const accessToken = await this.tokenService.accessToken(payload);
      const refreshToken = await this.tokenService.refreshToken(payload);
      await this.tokenService.writeCookie(
        res,
        'teacherToken',
        refreshToken,
        30,
      );

      return successRes({
        token: accessToken,
        user: {
          id: teacher.id,
          username: teacher.username,
          fullName: teacher.name,
          role: teacher.role,
          createdAt: teacher.createdAt,
          updatedAt: teacher.updatedAt,
        },
      });
    } else {
      throw new HttpException('Role not found', 400);
    }
  }

  async refreshAdmin(token: string) {
    const data: any = await this.tokenService.verifyToken(
      token,
      appConfig.TOKEN.REFRESH_TOKEN_KEY,
    );
    if (!data) {
      throw new HttpException('Authorization error', 401);
    }

    const user = await this.adminRepo.findOne({
      where: { id: data?.id, isActive: true, isDeleted: false },
    });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    const paylod: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: Roles.ADMIN,
    };
    const accessToken = await this.tokenService.accessToken(paylod);
    return successRes({ token: accessToken, paylod });
  }

  async refreshTeacher(token: string) {
    const data: any = await this.tokenService.verifyToken(
      token,
      appConfig.TOKEN.REFRESH_TOKEN_KEY,
    );

    if (!data) {
      throw new HttpException('Authorization error', 401);
    }

    const user = await this.teacherRepo.findOne({
      where: { id: data?.id, isActive: true, isDeleted: false },
    });

    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }

    const paylod: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };

    const accessToken = await this.tokenService.accessToken(paylod);

    return successRes({ token: accessToken, paylod });
  }

  async studentrefresh(token: string) {
    const data: any = await this.tokenService.verifyToken(
      token,
      appConfig.TOKEN.REFRESH_TOKEN_KEY,
    );

    if (!data) throw new HttpException('Authorization error', 401);

    const user = await this.teacherRepo.findOne({
      where: { id: data?.id, isActive: true, isDeleted: false },
    });

    if (!user) throw new ForbiddenException('Forbidden user');

    const paylod: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };
    const accessToken = await this.tokenService.accessToken(paylod);
    return successRes({ token: accessToken, paylod });
  }

  async signOut(res: Response, tokenKey: string) {
    res.clearCookie(tokenKey);
    return successRes({});
  }
}
