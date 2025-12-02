import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { BaseService } from 'src/infrastructure';
import { SpecificationEntity, TeacherEntity } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { successRes } from 'src/infrastructure/response/success.response';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { UpdateTeacherDtoForAdmin } from './dto/update-teacher-for-admin.dto';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { SigninDto } from 'src/common/dto/signin.dto';
import { Response } from 'express';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TeacherService extends BaseService<
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherEntity
> {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(SpecificationEntity)
    private readonly specificationRepo: Repository<SpecificationEntity>,
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

    const specification = await this.specificationRepo.findBy({
      id: In(createTeacherDto.specification),
    });
    if (specification.length === 0) {
      throw new BadRequestException('Specification not found');
    }

    const newTeacher = await this.teacherRepo.save(
      this.teacherRepo.create({
        ...createTeacherDto,
        specifications: specification,
      }),
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

  async updateForAdmin(id: string, dto: UpdateTeacherDtoForAdmin) {
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: ['specifications'], // ManyToMany relation ni yuklaymiz
    });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    if (dto.username) {
      const existsUsername = await this.teacherRepo.findOne({
        where: { username: dto.username, id: Not(id) },
      });
      if (existsUsername)
        throw new ConflictException('Username already exists');
    }

    let specifications = teacher.specifications;
    if (dto.specification && dto.specification.length) {
      specifications = await this.specificationRepo.findBy({
        id: In(dto.specification),
      });

      if (!specifications.length)
        throw new BadRequestException('Specifications not found');
    }

    if (dto.password) {
      dto.password = await this.cryptoService.encrypt(dto.password);
    }

    const updatingTeacher = await this.teacherRepo.save({
      ...teacher,
      ...dto,
      specifications,
    });

    return successRes(updatingTeacher);
  }

  async updateForTeacher(id: string, dto: UpdateTeacherDto) {
    // 1️⃣ Teacher topish
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: ['specifications'], // ManyToMany relationni yuklaymiz
    });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    // 2️⃣ Username tekshirish
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

    // 3️⃣ Specifications tekshirish
    let specifications = teacher.specifications; // eski specifications
    if (dto.specification && dto.specification.length) {
      specifications = await this.specificationRepo.findBy({
        id: In(dto.specification),
      });

      if (!specifications.length)
        throw new BadRequestException('Specifications not found');
    }

    const updatingTeacher = await this.teacherRepo.save({
      ...teacher,
      ...dto,
      specifications,
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

  async updateAvatar(id: string, file: Express.Multer.File): Promise<ISuccess> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    const avatarUrl = join('/uploads', file.filename);
    const deletedAvatarUrl = join(process.cwd(), teacher.avatarUrl);

    if (existsSync(deletedAvatarUrl)) {
      unlinkSync(deletedAvatarUrl);
    }

    await this.teacherRepo.update(id, { avatarUrl });

    const updatedTeacher = await this.teacherRepo.findOne({ where: { id } });
    return successRes(updatedTeacher);
  }

  async deleteAvatar(id: string): Promise<ISuccess> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    const deletedAvatarUrl = join(process.cwd(), teacher.avatarUrl);

    if (existsSync(deletedAvatarUrl)) {
      unlinkSync(deletedAvatarUrl);
    }

    teacher.avatarUrl = '';

    const updated = await this.teacherRepo.save(teacher);

    return successRes(updated);
  }
}
