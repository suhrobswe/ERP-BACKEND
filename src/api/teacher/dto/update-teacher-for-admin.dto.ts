import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDtoForAdmin extends PartialType(CreateTeacherDto) {}
