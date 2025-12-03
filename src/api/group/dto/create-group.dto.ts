import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Frontend Team', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '09:00',
    description: 'Lesson start time (HH:MM)',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    example: '11:00',
    description: 'Lesson end time (HH:MM)',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    example: 3,
    description: 'Duration in months',
  })
  @IsInt()
  @Min(1)
  @Max(36)
  durationInMonths: number;

  @ApiProperty({
    example: 'uuid-of-teacher',
    description: 'Teacher ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  teacherId?: string;
}
