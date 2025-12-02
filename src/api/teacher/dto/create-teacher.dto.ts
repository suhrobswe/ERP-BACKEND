import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'John Doe', description: 'Teacher full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john123', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Teacher specifications IDs',
    type: [String], // array of strings
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray({ message: 'Specifications should be an array' })
  @ArrayNotEmpty({ message: 'Specifications cannot be empty' })
  @IsUUID('all', {
    each: true,
    message: 'Each specification must be a valid UUID',
  })
  specification: string[];
}
