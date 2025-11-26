import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, TeacherEntity } from 'src/core';
import { CryptoService } from 'src/infrastructure/crypto/crypto.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, TeacherEntity])],
  providers: [AuthService, TokenService, CryptoService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
