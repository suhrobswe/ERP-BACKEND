import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/common/enum/roles.enum';
import { TeacherSpecialization } from 'src/common/enum/specialization.enum';

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
    enum: TeacherSpecialization,
    default: TeacherSpecialization.FULLSTACK,
  })
  @IsEnum(TeacherSpecialization)
  @IsOptional()
  specification?: TeacherSpecialization;
}
