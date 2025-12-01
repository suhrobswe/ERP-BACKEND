import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Res,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/roles.enum';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { PaginationQueryDto } from 'src/common/dto/query.dto';
import { ILike } from 'typeorm';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { type IToken } from 'src/infrastructure/token/interface';
import { UpdateStudentDtoForAdmin } from './dto/update-student-for-admin.dto';
import { SigninDtoStudent } from './dto/sgnin.dto';
import { type Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';
import { ApiImageFile } from 'src/common/decorator/upload.decorator';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly authservice: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create student for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin student' })
  @accessRoles('public')
  signin(
    @Body() signInDto: SigninDtoStudent,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.signin(signInDto, res);
  }

  @Post('signout')
  @ApiOperation({ summary: 'Signup student' })
  @accessRoles(Roles.STUDENT)
  signup(@Res({ passthrough: true }) res: Response) {
    return this.authservice.signOut(res, 'studentToken');
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students with pagination for admin and superadmin',
  })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  findAll(@Query() query: PaginationQueryDto) {
    return this.studentService.findAllWithPagination({
      where: query.query ? { name: ILike(`%${query.query}%`) } : {},
      skip: query.page,
      take: query.pageSize,
      relations: { group: true },
    });
  }

  @Get('for-admins/:id')
  @ApiOperation({ summary: 'Get student by id for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  findOneForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.findOneById(id, {
      relations: { group: true },
    });
  }

  @Get('details')
  @ApiOperation({ summary: 'Get student by id for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  findOne(@CurrentUser() user: IToken) {
    return this.studentService.findOneById(user.id);
  }

  @Patch('for-admins/:id')
  @ApiOperation({ summary: 'Update student for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  updateForAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDtoForAdmin,
  ) {
    return this.studentService.updateStudentForAdmin(id, updateStudentDto);
  }

  @Patch('details')
  @ApiOperation({ summary: 'Update student for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  update(
    @Body() updateStudentDto: UpdateStudentDto,
    @CurrentUser() user: IToken,
  ) {
    return this.studentService.updateStudentForAdmin(user.id, updateStudentDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update student password for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: IToken,
  ) {
    return this.studentService.updatePassword(user.id, updatePasswordDto);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN)
  @ApiBearerAuth()
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.softDelete(id);
  }

  @Patch('update-avatar')
  @ApiOperation({ summary: 'Update avatar (Universal Upload)' })
  @accessRoles(Roles.STUDENT)
  @ApiBearerAuth()
  @ApiImageFile('file', true)
  updateAvatar(
    @CurrentUser() user: IToken,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException('File is required', 400);

    return this.studentService.updateAvatar(user.id, file);
  }

  @Delete('delete-avatar')
  @ApiOperation({ summary: 'Delete avatar' })
  @accessRoles(Roles.STUDENT,)
  @ApiBearerAuth()
  deleteAvatar(@CurrentUser() user: IToken) {
    return this.studentService.deleteAvatar(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student for admin and superadmin' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.delete(id);
  }
}
