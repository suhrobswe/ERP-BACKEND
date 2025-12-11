import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  UploadedFile,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import { Roles } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SwaggerSuccessResponse } from 'src/common/decorator/swaggerSuccessRes.decorator';
import { CreateTeacherDoc } from 'src/common/document/swagger/teacher/createTeacher';
import { SwaggerErrorResponse } from 'src/common/decorator/swaggerErrorRes.decorator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';
import { ILike } from 'typeorm';
import { PaginationTeacherDoc } from 'src/common/document/swagger/teacher/paginationTeacher';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { type IToken } from 'src/infrastructure/token/interface';
import { UpdateTeacherDtoForAdmin } from './dto/update-teacher-for-admin.dto';
import { getTeacherDoc } from 'src/common/document/swagger/teacher/get';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { SigninDto } from 'src/common/dto/signin.dto';
import { type Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { ApiImageFile } from 'src/common/decorator/upload.decorator';
import { parse } from 'path';
import { StatusDto } from './dto/status.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'for admin and super admin' })
  @SwaggerSuccessResponse(CreateTeacherDoc.success)
  @SwaggerErrorResponse(CreateTeacherDoc.error)
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'for teacher' })
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @accessRoles('public')
  signin(
    @Body() signInDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.teacherService.signin(signInDto, res);
  }

  @Post('signout')
  @ApiOperation({ summary: 'for teacher' })
  @accessRoles(Roles.TEACHER)
  signOut(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res, 'teacherToken');
  }

  @Get()
  @SwaggerSuccessResponse(PaginationTeacherDoc.success)
  @ApiOperation({
    summary: 'get all with pagination , for admin and super admin',
  })
  @SwaggerSuccessResponse(PaginationTeacherDoc.success)
  @SwaggerErrorResponse(PaginationTeacherDoc.error)
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  findAll(@Query() query: PaginationQueryDto) {
    return this.teacherService.findAllWithPagination({
      where: query.query ? { name: ILike(`%${query.query}%`) } : {},
      skip: query.page,
      take: query.pageSize,
      relations: { groups: true, specifications: true },
    });
  }

  @Get('details')
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @ApiOperation({ summary: 'for teachers' })
  @ApiBearerAuth()
  @accessRoles(Roles.TEACHER)
  findOne(@CurrentUser() user: IToken) {
    return this.teacherService.findOneById(user.id);
  }

  @Get(':id')
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @ApiOperation({ summary: 'for admin and super admin' })
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.findOneById(id);
  }

  @Patch(':id')
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @ApiOperation({ summary: 'for admin and super admin' })
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeacherDto: UpdateTeacherDtoForAdmin,
  ) {
    return this.teacherService.updateForAdmin(id, updateTeacherDto);
  }

  @Patch('details')
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @ApiOperation({ summary: 'for teachers' })
  @ApiBearerAuth()
  @accessRoles(Roles.TEACHER)
  updateDetails(
    @Body() updateTeacherDto: UpdateTeacherDto,
    @CurrentUser() user: IToken,
  ) {
    return this.teacherService.updateForTeacher(user.id, updateTeacherDto);
  }

  @Patch('password')
  @SwaggerSuccessResponse(getTeacherDoc.successOne)
  @SwaggerErrorResponse({
    statusCode: 400,
    timestamp: '2025-11-23T11:59:13.564Z',
    path: '/api/v1/teacher/password',
    method: 'PATCH',
    error: 'HttpException',
    message: 'Old password is incorrect',
  })
  @ApiOperation({ summary: 'for teachers' })
  @ApiBearerAuth()
  @accessRoles(Roles.TEACHER)
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: IToken,
  ) {
    return this.teacherService.updatePassword(user.id, updatePasswordDto);
  }

  @Patch('status/:id')
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.teacherService.updateStatusIsActive(id, dto);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN)
  @ApiBearerAuth()
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.softDelete(id);
  }

    @Patch('update-avatar-teacher/:id')
  @ApiOperation({ summary: 'Update avatar for admin (Universal Upload)' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.TEACHER)
  @ApiBearerAuth()
  @ApiImageFile('file', true)
  updateAvatarTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException('File is required', 400);

    return this.teacherService.updateAvatar(id, file);
  }

  @Patch('update-avatar')
  @ApiOperation({ summary: 'Update avatar (Universal Upload)' })
  @accessRoles(Roles.TEACHER)
  @ApiBearerAuth()
  @ApiImageFile('file', true)
  updateAvatar(
    @CurrentUser() user: IToken,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException('File is required', 400);

    return this.teacherService.updateAvatar(user.id, file);
  }

  @Delete('delete-avatar')
  @ApiOperation({ summary: 'Delete avatar' })
  @accessRoles(Roles.TEACHER)
  @ApiBearerAuth()
  deleteAvatar(@CurrentUser() user: IToken) {
    return this.teacherService.deleteAvatar(user.id);
  }

  @Delete(':id')
  @SwaggerSuccessResponse({
    example: {
      statusCode: 200,
      message: {
        uz: 'Amaliyot muvaffaqiyatli bajarildi',
        en: 'Operation successfully completed',
        ru: 'Операция успешно выполнена',
      },
    },
  })
  @SwaggerErrorResponse(getTeacherDoc.errorOne)
  @ApiOperation({ summary: 'for admin and super admin' })
  @ApiBearerAuth()
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.teacherService.delete(id);
  }
}
