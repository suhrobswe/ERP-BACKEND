import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/common/enum/roles.enum';
import {
  AdminEntity,
  GroupEntity,
  StudentEntity,
  TeacherEntity,
} from 'src/core';
import { ISuccess } from 'src/infrastructure/pagination/successResponse';
import { successRes } from 'src/infrastructure/response/success.response';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(TeacherEntity)
    private teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private studentRepo: Repository<StudentEntity>,
    @InjectRepository(GroupEntity) private groupRepo: Repository<GroupEntity>,
  ) {}

  async getStatisticAll() {
    const adminCount = await this.adminRepo.count({
      where: { role: Roles.ADMIN },
    });
    const teacherCount = await this.teacherRepo.count();
    const studentCount = await this.studentRepo.count();
    const groupCount = await this.groupRepo.count();
    return successRes({ adminCount, teacherCount, studentCount, groupCount });
  }

  async getTopTeachers(): Promise<
    ISuccess
  > {
    const teachers = await this.teacherRepo
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.groups', 'group')
      .select('teacher.name AS teacherName', 'COUNT(group.id) AS groupCount')
      .groupBy('teacher.name')
      .orderBy('groupCount', 'DESC')
      .limit(10)
      .getRawMany();

    return successRes(teachers);
  }

  async getTopGroups(): Promise<ISuccess> {
    const groups = await this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.students', 'student')
      .select('group.name AS groupName', 'COUNT(student.id) AS studentCount')
      .groupBy('group.name')
      .orderBy('studentCount', 'DESC')
      .limit(10)
      .getRawMany();

    return successRes(groups);
  }

  async getAverageAgeStudents(): Promise<ISuccess> {
    const students = await this.studentRepo
      .createQueryBuilder('student')
      .select('AVG(student.age)', 'averageAge')
      .getRawOne();

    return successRes(students);
  }

  async getAverageAgeTeachers(): Promise<ISuccess> {
    const teachers = await this.teacherRepo
      .createQueryBuilder('teacher')
      .select('AVG(teacher.age)', 'averageAge')
      .getRawOne();

    return successRes(teachers);
  }
}
