import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Frontend Team', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2025-10-10',
    description: 'Lesson date (YYYY-MM-DD)',
  })
  @IsDateString()
  lessonTime: string;

  @ApiProperty({
    example: 'uuid-of-teacher',
    description: 'Teacher ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  teacherId?: string;
}
