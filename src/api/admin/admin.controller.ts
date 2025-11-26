import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/roles.enum';
import { AuthService } from '../auth/auth.service';
import { type Response } from 'express';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { CookieGetter } from 'src/common/decorator/cookieGetter.decorator';
import { type IToken } from 'src/infrastructure/token/interface';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { SigninDto } from 'src/common/dto/signin.dto';
import { SwaggerSuccessResponse } from 'src/common/decorator/swaggerSuccessRes.decorator';
import { SwaggerErrorResponse } from 'src/common/decorator/swaggerErrorRes.decorator';
import {
  createAdminDoc,
  refreshAdminDoc,
  signInDoc,
  signOutDoc,
} from 'src/common/document';
import { meAdminDoc } from 'src/common/document/swagger/admin/meAdmin';
import {
  getAllAdminDoc,
  getOneAdminDoc,
} from 'src/common/document/swagger/admin/getAdmin';
import { get } from 'http';
import { UpdatePasswordDto } from 'src/common/dto/update-password.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('create-admin')
  @SwaggerSuccessResponse(createAdminDoc.success)
  @SwaggerErrorResponse(createAdminDoc.error.password)
  @SwaggerErrorResponse(createAdminDoc.error.username)
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  createAdmin(@Body() createDto: CreateAdminDto) {
    return this.adminService.createAdmin(createDto);
  }

  @Post('signin')
  @SwaggerSuccessResponse(signInDoc.success)
  @SwaggerErrorResponse(signInDoc.error)
  @ApiOperation({ summary: 'public' })
  @accessRoles('public')
  signIn(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
    return this.adminService.signIn(dto, res);
  }

  @Post('refresh')
  @SwaggerSuccessResponse(refreshAdminDoc.success)
  @SwaggerErrorResponse(refreshAdminDoc.error)
  @ApiOperation({ summary: 'for super admin and admin' })
  @accessRoles('public')
  refresh(@CookieGetter('adminToken') token: string) {
    return this.authService.newToken(this.adminService.getRepository, token);
  }

  @Post('signout')
  @SwaggerSuccessResponse(signOutDoc.success)
  @SwaggerErrorResponse(signOutDoc.error)
  @ApiOperation({ summary: 'for super admin and admin' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN)
  @ApiBearerAuth()
  signOut(
    @CookieGetter('adminToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(res, 'adminToken');
  }

  @Get('me')
  @SwaggerSuccessResponse(meAdminDoc.success)
  @SwaggerErrorResponse(meAdminDoc.error)
  @ApiOperation({ summary: 'for super admin and admin' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN)
  @ApiBearerAuth()
  getProfile(@CurrentUser() user: IToken) {
    return this.adminService.findOneById(user.id, {
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get('all')
  @SwaggerSuccessResponse(getAllAdminDoc.success)
  @SwaggerErrorResponse(getAllAdminDoc.error)
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  getAll() {
    return this.adminService.findAll({ order: { createdAt: 'DESC' } });
  }

  @Get('details')
  @SwaggerSuccessResponse(getOneAdminDoc.success)
  @SwaggerErrorResponse(getOneAdminDoc.error)
  @ApiOperation({ summary: 'for admin' })
  @accessRoles(Roles.ADMIN)
  @ApiBearerAuth()
  getDetails(@CurrentUser() user: IToken) {
    return this.adminService.findOneById(user.id);
  }

  @Patch('update-details')
  @SwaggerSuccessResponse(getOneAdminDoc.success)
  @SwaggerErrorResponse(getOneAdminDoc.error)
  @ApiOperation({ summary: 'for super admin and admin' })
  @accessRoles(Roles.SUPER_ADMIN, 'ID')
  @ApiBearerAuth()
  updateDetails(@Body() dto: UpdateAdminDto, @CurrentUser() user: IToken) {
    return this.adminService.updateAdmin(user.id, dto);
  }

  @Patch('update-password')
  @SwaggerSuccessResponse(getOneAdminDoc.success)
  @SwaggerErrorResponse(getOneAdminDoc.error)
  @ApiOperation({ summary: 'for admins' })
  @accessRoles(Roles.SUPER_ADMIN, 'ID')
  @ApiBearerAuth()
  updatePassword(@Body() dto: UpdatePasswordDto, @CurrentUser() user: IToken) {
    return this.adminService.updatePassword(user.id, dto);
  }

  @Delete('delete/:id')
  @SwaggerSuccessResponse(signOutDoc.success)
  @SwaggerErrorResponse(signOutDoc.error)
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.delete(id);
  }
}
