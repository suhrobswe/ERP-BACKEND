import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Studentning ismi' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'ali@gmail.com',
    description: 'Student email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Parol' })
  @IsStrongPassword()
  password: string;

  // @ApiProperty({ example: 1, description: 'level for student' })
  // @IsNumber()
  // @IsNotEmpty()
  // level: number;

  @ApiProperty({
    example: 'a3f3cd7e-1b0b-47cd-8a6a-4b2c0c6e9f05',
    description: 'Group ID',
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  groupId?: string;
}
