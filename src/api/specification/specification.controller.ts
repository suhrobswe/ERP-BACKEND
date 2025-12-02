import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/roles.enum';
import { accessRoles } from 'src/common/decorator/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('specification')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create specification (admin, super-admin)' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationService.create(createSpecificationDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create specification' })
  @accessRoles('public')
  createBulk() {
    return this.specificationService.createBulk();
  }

  @Get()
  @ApiOperation({ summary: 'Get all specification (all users)' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER, Roles.STUDENT)
  findAll() {
    return this.specificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all specification (all users)' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER, Roles.STUDENT)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.specificationService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specification (admin, super-admin)' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return this.specificationService.update(id, updateSpecificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specification (admin, super-admin)' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.specificationService.delete(id);
  }
}
