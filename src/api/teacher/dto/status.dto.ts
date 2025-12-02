import { IsBoolean, IsNotEmpty } from 'class-validator';

export class StatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
