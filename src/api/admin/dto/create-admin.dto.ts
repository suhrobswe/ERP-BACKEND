import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: String,
    description: 'Adminning username',
    example: 'admin_user',
    required: false,
  })
  @IsString({ message: 'username satr (string) bolishi kerak' })
  @IsNotEmpty({ message: "username bo'sh bo'lmasligi kerak" })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Toliq ism (2–50 belgidan iborat bolishi kerak)',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: 'fullName satr (string) bolishi kerak' })
  @Length(2, 50, { message: 'fullName uzunligi 2 dan 50 gacha bolishi kerak' })
  fullName: string;

  @ApiProperty({
    type: String,
    description:
      'Mustahkam parol: kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi bolishi kerak',
    example: 'Admin!',
    minLength: 8,
    required: true,
  })
  @IsString({ message: 'password satr (string) bolishi kerak' })
  @IsStrongPassword()
  password: string;
}
