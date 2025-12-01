import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: 'Kirish darsi' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'uuid-v4-id' })
  @IsUUID()
  @IsOptional()
  lessonId?: string;
}
