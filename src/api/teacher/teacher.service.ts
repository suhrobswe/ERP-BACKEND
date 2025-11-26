import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { BaseService } from 'src/infrastructure';
import { TeacherEntity } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { successRes } from 'src/infrastructure/response/success.response';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { UpdateTeacherDtoForAdmin } from './dto/update-teacher-for-admin.dto';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { SigninDto } from 'src/common/dto/signin.dto';
import { Response } from 'express';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';

@Injectable()
export class TeacherService extends BaseService<
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherEntity
> {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(teacherRepo);
  }
  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const existsUsername = await this.teacherRepo.findOne({
      where: { username: createTeacherDto.username },
    });
    if (existsUsername) {
      throw new ConflictException('Username already exists');
    }
    createTeacherDto.password = await this.cryptoService.encrypt(
      createTeacherDto.password,
    );

    const newTeacher = await this.teacherRepo.save(
      this.teacherRepo.create(createTeacherDto),
    );
    return successRes(newTeacher, 201);
  }

  async signin(signInDto: SigninDto, res: Response) {
    const { username, password } = signInDto;
    const teacher = await this.teacherRepo.findOne({ where: { username } });

    const isMatchPassword = await this.cryptoService.decrypt(
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
    await this.tokenService.writeCookie(res, 'teacherToken', refreshToken, 30);

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
  }

  async updateForAdmin(id: string, updateTeacherDto: UpdateTeacherDtoForAdmin) {
    const existingTeacher = await this.findOneById(id);

    if (updateTeacherDto.username) {
      const existsUsername = await this.teacherRepo.findOne({
        where: { username: updateTeacherDto.username, id: Not(id) },
      });
      if (existsUsername) {
        throw new ConflictException({
          message: 'Username already exists',
          field: 'username',
        });
      }
    }

    if (updateTeacherDto.password) {
      updateTeacherDto.password = await this.cryptoService.encrypt(
        updateTeacherDto.password,
      );
    }

    const updatingTeacher = await this.teacherRepo.save({
      ...existingTeacher.data,
      ...updateTeacherDto,
    });
    return successRes(updatingTeacher);
  }

  async updateForTeacher(id: string, dto: UpdateTeacherDto) {
    const teacher = await this.findOneById(id);

    if (dto.username) {
      const existsUsername = await this.teacherRepo.findOne({
        where: { username: dto.username, id: Not(id) },
      });
      if (existsUsername) {
        throw new ConflictException({
          message: 'Username already exists',
          field: 'username',
        });
      }
    }

    const updatingTeacher = await this.teacherRepo.save({
      ...teacher.data,
      ...dto,
    });
    return successRes(updatingTeacher);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<ISuccess> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    const isMatchPassword = await this.cryptoService.decrypt(
      dto.oldPassword,
      teacher.password,
    );
    if (!isMatchPassword)
      throw new BadRequestException({
        message: 'Old password is incorrect',
        field: 'oldPassword',
      });

    const newPassword = await this.cryptoService.encrypt(dto.newPassword);
    const updated = await this.teacherRepo.save({
      ...teacher,
      password: newPassword,
    });

    return successRes(updated);
  }
}
