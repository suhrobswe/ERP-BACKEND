import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class SigninDto {
  @ApiProperty({
    type: String,
    description: 'Adminning username',
    example: 'Admin1',
  })
  @IsString({ message: 'username satr (string) bolishi kerak' })
  @IsNotEmpty({ message: "username bo'sh bo'lmasligi kerak" })
  username: string;

  @ApiProperty({
    type: String,
    description:
      'Mustahkam parol: kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf, 1 ta raqam va 1 ta maxsus belgi bolishi kerak',
    example: 'Admin1!',
  })
  @IsString({ message: 'password satr (string) bolishi kerak' })
  @IsNotEmpty({ message: "password bo'sh bo'lmasligi kerak" })
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  role: string;
}
