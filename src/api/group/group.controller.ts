import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/roles.enum';
import { PaginationQueryDto } from 'src/common/dto/query.dto';
import { ILike } from 'typeorm';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { type IToken } from 'src/infrastructure/token/interface';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { AuthGuard } from 'src/common/guard/AuthGuard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create group for admins and superadmins' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all groups with pagination for admins and superadmins',
  })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  findAll(@Query() query: PaginationQueryDto) {
    return this.groupService.findAllWithPagination({
      where: query.query ? { name: ILike(`%${query.query}%`) } : {},
      skip: query.page,
      take: query.pageSize,
    });
  }

  @Get('for-admin:id')
  @ApiOperation({ summary: 'Get group by id for admins and superadmins' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupService.findOneById(id, {
      relations: { teacher: true, students: true },
    });
  }

  @Get('for-teacher:id')
  @ApiOperation({ summary: 'Get group by id for teachers ' })
  @accessRoles(Roles.TEACHER)
  @ApiBearerAuth()
  findForTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: IToken,
  ) {
    return this.groupService.findForTeacher(user.id, id);
  }

  @Get('for-student:id')
  @ApiOperation({ summary: 'Get group by id for students' })
  @accessRoles(Roles.STUDENT)
  @ApiBearerAuth()
  findForStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: IToken,
  ) {
    return this.groupService.findForStudent(user.id, id);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ summary: 'for super admin' })
  @accessRoles(Roles.SUPER_ADMIN, Roles.ADMIN)
  @ApiBearerAuth()
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupService.softDelete(id);
  }

  @Patch('details:id')
  @ApiOperation({ summary: 'Update group for admins and superadmins' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group for admins and superadmins' })
  @accessRoles(Roles.ADMIN, Roles.SUPER_ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupService.delete(id);
  }
}
// 6c67fdeb-5af0-46e9-9ca5-e52502ae175d
