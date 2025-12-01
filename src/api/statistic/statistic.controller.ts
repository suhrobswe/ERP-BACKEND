import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import { RolesGuard } from 'src/common/guard/RolesGuard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { accessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/roles.enum';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  @accessRoles(Roles.ADMIN)
  getStatistic() {
    return this.statisticService.getStatisticAll();
  }

  @Get('/top-teachers')
  @accessRoles(Roles.ADMIN)
  getTopTeachers() {
    return this.statisticService.getTopTeachers();
  }

  @Get('/top-groups')
  @accessRoles(Roles.ADMIN)
  getTopGroups() {
    return this.statisticService.getTopGroups();
  }

  @Get('/average-age-students')
  @accessRoles(Roles.ADMIN)
  getAverageAgeStudents() {
    return this.statisticService.getAverageAgeStudents();
  }

  @Get('/average-age-teachers')
  @accessRoles(Roles.ADMIN)
  getAverageAgeTeachers() {
    return this.statisticService.getAverageAgeTeachers();
  }
}
