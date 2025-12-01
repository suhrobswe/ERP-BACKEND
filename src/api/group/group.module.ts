import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from 'src/core';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity]), TeacherModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
