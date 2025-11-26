import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SigninDtoStudent {
  @ApiProperty({
    example: 'ali@gmail.com',
    description: 'Student email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Parol' })
  @IsStrongPassword()
  password: string;
}
