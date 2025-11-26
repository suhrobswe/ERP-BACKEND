import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SwaggerSuccessResponse } from 'src/common/decorator/swaggerSuccessRes.decorator';
import { SwaggerErrorResponse } from 'src/common/decorator/swaggerErrorRes.decorator';
import { signInDoc } from 'src/common/document';
import { ApiOperation } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { SigninDto } from 'src/common/dto/signin.dto';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @SwaggerSuccessResponse(signInDoc.success)
  @SwaggerErrorResponse(signInDoc.error)
  @ApiOperation({ summary: 'public' })
  @accessRoles('public')
  signIn(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(dto, res);
  }
}
