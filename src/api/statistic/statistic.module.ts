import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminEntity,
  GroupEntity,
  StudentEntity,
  TeacherEntity,
} from 'src/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      TeacherEntity,
      StudentEntity,
      GroupEntity,
    ]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
