import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TeacherEntity } from 'src/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity]), AuthModule],
  controllers: [TeacherController],
  providers: [TeacherService, CryptoService, TokenService, ],
  exports: [TeacherService],
})
export class TeacherModule {}
