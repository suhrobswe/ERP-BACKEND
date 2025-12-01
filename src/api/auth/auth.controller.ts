import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SwaggerSuccessResponse } from 'src/common/decorator/swaggerSuccessRes.decorator';
import { SwaggerErrorResponse } from 'src/common/decorator/swaggerErrorRes.decorator';
import { signInDoc } from 'src/common/document';
import { ApiOperation } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { SigninDto } from 'src/common/dto/signin.dto';
import { type Response } from 'express';
import { CookieGetter } from 'src/common/decorator/cookieGetter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @SwaggerSuccessResponse(signInDoc.success)
  @SwaggerErrorResponse(signInDoc.error)
  @ApiOperation({ summary: 'public' })
  @accessRoles('public')
  signIn(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
    console.log('dto', dto);
    return this.authService.signin(dto, res);
  }

  @Post('refresh')
  @accessRoles('public')
  refresh(
    @Body() dto: 'admin' | 'teacher' | 'student',
    @CookieGetter('adminToken') adminToken: string,
    @CookieGetter('teacherToken') teacherToken: string,
    @CookieGetter('studentToken') studentToken: string,
  ) {
    if (dto === 'admin') {
      return this.authService.refreshAdmin(adminToken);
    } else if (dto === 'teacher') {
      return this.authService.refreshTeacher(teacherToken);
    } else {
      return this.authService.studentrefresh(studentToken);
    }
  }

  async adminRefresh(@CookieGetter('adminToken') token: string) {
    return this.authService.refreshAdmin(token);
  }

  async teacherRefresh(token: string) {
    return this.authService.refreshTeacher(token);
  }

  async studentRefresh(token: string) {
    return this.authService.studentrefresh(token);
  }
}
