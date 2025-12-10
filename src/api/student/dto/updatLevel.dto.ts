import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLevelDto {
  @ApiProperty({ example: 1, description: 'level for student' })
  @IsNumber()
  @IsNotEmpty()
  level: number;
}
