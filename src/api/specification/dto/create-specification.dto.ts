import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecificationDto {

  @ApiProperty({
    description: 'Teacher specialization',
  })
  @IsNotEmpty()
  @IsString()
  category: string;
  @ApiProperty({
    description: 'Teacher specialization',
  })
  @IsNotEmpty()
  @IsString()
  specification: string;
}
