import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core';
import { successRes } from 'src/infrastructure/response/success.response';
import { Not, Repository } from 'typeorm';
import { TokenService } from 'src/infrastructure/token/Token';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { type Response } from 'express';
import { SigninDto } from 'src/common/dto/signin.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { appConfig } from 'src/config';
import { Roles } from 'src/common/enum/roles.enum';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AdminService
  extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly tokenService: TokenService,
    private readonly crypto: CryptoService,
  ) {
    super(adminRepo);
  }

  async onModuleInit() {
    const superAdmin = await this.adminRepo.findOne({
      where: { role: Roles.SUPER_ADMIN },
    });
    if (!superAdmin) {
      const password = await this.crypto.encrypt(
        appConfig.SUPER_ADMIN.PASSWORD,
      );
      const data = this.adminRepo.create({
        username: appConfig.SUPER_ADMIN.USERNAME,
        password,
        fullName: appConfig.SUPER_ADMIN.FULLNAME,
        role: Roles.SUPER_ADMIN,
      });
      await this.adminRepo.save(data);
      console.log('Super Admin created');
    } else {
      console.log('Super Admin already exists');
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    const existsUsername = await this.adminRepo.findOneBy({
      username: dto.username,
    });

    if (existsUsername) throw new HttpException('Username already exists', 409);

    dto.password = await this.crypto.encrypt(dto.password);

    const adminData = this.adminRepo.create(dto);
    const data = await this.adminRepo.save(adminData);

    return successRes(data, 201);
  }

  async updateAdmin(id: string, dto: UpdateAdminDto): Promise<ISuccess> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new HttpException('Admin not found', 404);

    if (dto.username) {
      const existsUsername = await this.adminRepo.findOne({
        where: { username: dto.username, id: Not(id) },
      });
      if (existsUsername)
        throw new HttpException('Username already exists', 409);
    }

    await this.adminRepo.update(id, dto);
    const updated = await this.adminRepo.findOne({ where: { id } });

    return successRes(updated);
  }

  async signIn(signInDto: SigninDto, res: Response) {
    const { username, password } = signInDto;
    const admin = await this.adminRepo.findOne({ where: { username } });

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
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<ISuccess> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new HttpException('Admin not found', 404);

    const isMatchPassword = await this.crypto.decrypt(
      dto.oldPassword,
      admin.password,
    );
    if (!isMatchPassword)
      throw new HttpException('Old password is incorrect', 400);

    const newPassword = await this.crypto.encrypt(dto.newPassword);
    const updated = await this.adminRepo.update(id, { password: newPassword });

    return successRes(updated);
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<ISuccess> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new HttpException('Admin not found', 404);

    const avatarUrl = join('/uploads', file.filename);
    const deletedAvatarUrl = join(process.cwd(), admin.avatarUrl);

    if (existsSync(deletedAvatarUrl)) {
      unlinkSync(deletedAvatarUrl);
    }

    await this.adminRepo.update(id, { avatarUrl });

    const updatedAdmin = await this.adminRepo.findOne({ where: { id } });
    return successRes(updatedAdmin);
  }

  async deleteAvatar(id: string): Promise<ISuccess> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new HttpException('Admin not found', 404);

    const deletedAvatarUrl = join(process.cwd(), admin.avatarUrl);

    if (existsSync(deletedAvatarUrl)) {
      unlinkSync(deletedAvatarUrl);
    }

    admin.avatarUrl = '';

    const updated = await this.adminRepo.save(admin);

    return successRes(updated);
  }
}
