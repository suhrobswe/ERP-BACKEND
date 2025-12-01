import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { BaseService } from 'src/infrastructure';
import { StudentEntity } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { successRes } from 'src/infrastructure/response/success.response';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { UpdateStudentDtoForAdmin } from './dto/update-student-for-admin.dto';
import { SigninDtoStudent } from './dto/sgnin.dto';
import { Response } from 'express';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class StudentService extends BaseService<
  CreateStudentDto,
  UpdateStudentDto,
  StudentEntity
> {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(studentRepo);
  }

  async createStudent(dto: CreateStudentDto): Promise<ISuccess> {
    const excistsEmail = await this.studentRepo.findOne({
      where: { email: dto.email },
    });

    if (excistsEmail) throw new ConflictException('Email already exists');

    dto.password = await this.cryptoService.encrypt(dto.password);

    const newStudent = await this.studentRepo.save(
      this.studentRepo.create(dto),
    );

    return successRes(newStudent, 201);
  }

  async signin(signInDto: SigninDtoStudent, res: Response) {
    const { email, password } = signInDto;
    const student = await this.studentRepo.findOne({ where: { email } });

    const isMatchPassword = await this.cryptoService.decrypt(
      password,
      student?.password || '',
    );
    if (!student || !isMatchPassword)
      throw new BadRequestException('Username or password is incorrect');

    const payload: IToken = {
      id: student.id,
      isActive: student.isActive,
      role: student.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'studentToken', refreshToken, 30);

    return successRes({
      token: accessToken,
      user: {
        id: student.id,
        email: student.email,
        fullName: student.name,
        role: student.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
    });
  }

  async updateStudentForAdmin(id: string, dto: UpdateStudentDtoForAdmin) {
    const student = await this.studentRepo.findOne({ where: { id } });

    if (!student) throw new NotFoundException('Student not found');

    if (dto.email) {
      const excistsEmail = await this.studentRepo.findOne({
        where: { email: dto.email },
      });
      if (excistsEmail) throw new ConflictException('Email already exists');
    }

    if (dto.password) {
      dto.password = await this.cryptoService.encrypt(dto.password);
    }

    const updated = await this.studentRepo.save({
      ...student,
      ...dto,
    });

    return successRes(updated);
  }

  async updateStudent(id: string, dto: UpdateStudentDto): Promise<ISuccess> {
    const student = await this.studentRepo.findOne({ where: { id } });

    if (!student) throw new NotFoundException('Student not found');

    if (dto.email) {
      const excistsEmail = await this.studentRepo.findOne({
        where: { email: dto.email },
      });
      if (excistsEmail) throw new ConflictException('Email already exists');
    }

    const updated = await this.studentRepo.save({
      ...student,
      ...dto,
    });

    return successRes(updated);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    const isMatchPassword = await this.cryptoService.decrypt(
      dto.oldPassword,
      student.password,
    );
    if (!isMatchPassword)
      throw new BadRequestException('Old password is incorrect');

    student.password = await this.cryptoService.encrypt(dto.newPassword);

    return successRes(await this.studentRepo.save(student));
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<ISuccess> {
      const student = await this.studentRepo.findOne({ where: { id } });
      if (!student) throw new HttpException('Student not found', 404);
  
      const avatarUrl = join('/uploads', file.filename);
      const deletedAvatarUrl = join(process.cwd(), student.avatarUrl);
  
      if (existsSync(deletedAvatarUrl)) {
        unlinkSync(deletedAvatarUrl);
      }
  
      await this.studentRepo.update(id, { avatarUrl });
  
      const updatedStudent = await this.studentRepo.findOne({ where: { id } });
      return successRes(updatedStudent);
    }

    async deleteAvatar(id: string): Promise<ISuccess> {
    const teacher = await this.studentRepo.findOne({ where: { id } });
    if (!teacher) throw new HttpException('Teacher not found', 404);

    const deletedAvatarUrl = join(process.cwd(), teacher.avatarUrl);

    if (existsSync(deletedAvatarUrl)) {
      unlinkSync(deletedAvatarUrl);
    }

    teacher.avatarUrl = '';

    const updated = await this.studentRepo.save(teacher);

    return successRes(updated);
  }
}
