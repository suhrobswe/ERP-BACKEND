import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Adminning eski paroli',
  })
  @IsNotEmpty({ message: "password bo'sh bo'lmasligi kerak" })
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Adminning yangi paroli',
  })
  @IsStrongPassword()
  @IsNotEmpty({ message: "password bo'sh bo'lmasligi kerak" })
  newPassword: string;
}
